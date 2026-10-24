/**
 * scanner.js
 * Core scanning logic using Puppeteer + axe-core.
 * Runs in Node.js runtime only (not Edge).
 */

import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { join } from 'path';

const SCAN_TIMEOUT = parseInt(process.env.SCAN_TIMEOUT || '30000', 10);
const VIEWPORT = { width: 1366, height: 768 };

/**
 * Loads the axe-core source code to inject into the page.
 * We read the file directly so it works in the Next.js server environment.
 */
function getAxeSource() {
  // Resolve directly from disk to avoid Next.js RSC bundler mangling the path
  const axePath = join(process.cwd(), 'node_modules', 'axe-core', 'axe.js');
  return readFileSync(axePath, 'utf-8');
}

/**
 * Scans a URL for accessibility violations using Puppeteer + axe-core.
 *
 * @param {string} url - The fully validated URL to scan
 * @returns {Promise<object>} Raw axe-core results
 * @throws {Error} With a user-friendly message on failure
 */
export async function scanUrl(url) {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--safebrowsing-disable-auto-update',
      ],
    });

    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport(VIEWPORT);
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AccessibilityChecker/1.0'
    );

    // Set default timeout
    page.setDefaultNavigationTimeout(SCAN_TIMEOUT);
    page.setDefaultTimeout(SCAN_TIMEOUT);

    // Intercept and block unnecessary resources to speed up the scan
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['media', 'font', 'websocket'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // Navigate to the URL
    try {
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: SCAN_TIMEOUT,
      });
    } catch (navError) {
      if (navError.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        throw new Error(
          `Could not reach "${url}". The domain does not exist or DNS resolution failed.`
        );
      }
      if (navError.message.includes('net::ERR_CONNECTION_REFUSED')) {
        throw new Error(
          `Connection refused for "${url}". The server may be down or blocking automated requests.`
        );
      }
      if (navError.message.includes('TimeoutError') || navError.name === 'TimeoutError') {
        throw new Error(
          `The page took too long to load (>${SCAN_TIMEOUT / 1000}s). Try again or check if the site is slow.`
        );
      }
      if (navError.message.includes('net::ERR_CERT')) {
        throw new Error(
          `SSL certificate error for "${url}". The site may have an invalid or expired certificate.`
        );
      }
      throw new Error(`Failed to load page: ${navError.message}`);
    }

    // Inject axe-core
    const axeSource = getAxeSource();
    await page.evaluate(axeSource);

    // Run axe-core with WCAG 2.0/2.1 A and AA rules
    const axeResults = await page.evaluate(async () => {
      return await window.axe.run(document, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
        },
        resultTypes: ['violations', 'passes', 'incomplete', 'inapplicable'],
      });
    });

    return axeResults;
  } catch (err) {
    // Re-throw with clean message if it's already our error
    if (err.message && !err.message.startsWith('Protocol error') && !err.message.startsWith('Target')) {
      throw err;
    }
    throw new Error(
      `An unexpected error occurred during scanning: ${err.message}`
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // Ignore browser close errors
      }
    }
  }
}
