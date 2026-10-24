/**
 * POST /api/scan
 * Accepts { url } and returns a structured accessibility report.
 * Runs on Node.js runtime (not Edge) to support Puppeteer.
 */

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds max for Vercel, adjust for other hosts

import { NextResponse } from 'next/server';
import { validateUrl } from '../../../lib/validateUrl';
import { scanUrl } from '../../../lib/scanner';
import { formatReport } from '../../../lib/formatReport';


export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  const { url: rawUrl } = body || {};

  // Validate URL
  const { valid, url, error: validationError } = validateUrl(rawUrl);
  if (!valid) {
    return NextResponse.json(
      { error: validationError },
      { status: 400 }
    );
  }

  // Run the scan
  try {
    const axeResults = await scanUrl(url);
    const report = formatReport(axeResults, url);

    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    console.error('[Accessibility Scanner Error]', err.message);

    // Distinguish between user-facing errors and server errors
    const isClientError =
      err.message.includes('Could not reach') ||
      err.message.includes('Connection refused') ||
      err.message.includes('too long to load') ||
      err.message.includes('SSL certificate') ||
      err.message.includes('domain does not exist');

    return NextResponse.json(
      {
        error: err.message || 'An unexpected error occurred during the scan.',
        url,
      },
      { status: isClientError ? 422 : 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST with { url }.' },
    { status: 405 }
  );
}
