'use client';

import { useState, useRef } from 'react';
import UrlForm from '../components/UrlForm';
import SummaryCards from '../components/SummaryCards';
import ViolationList from '../components/ViolationList';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import styles from './page.module.css';


export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [scannedUrl, setScannedUrl] = useState('');
  const resultsRef = useRef(null);

  const handleScan = async (url) => {
    setIsLoading(true);
    setReport(null);
    setError(null);
    setScannedUrl(url);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      setReport(data);

      // Scroll to results after a brief delay
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const hostname = new URL(report.url).hostname.replace(/\./g, '-');
    a.download = `accessibility-report-${hostname}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header} role="banner">
        <div className={styles.headerInner}>
          <div className={styles.logo} aria-label="Accessibility Checker">
            <span className={styles.logoIcon} aria-hidden="true">♿</span>
            <span className={styles.logoText}>A11y Checker</span>
          </div>
          <nav className={styles.nav} aria-label="External links">
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              WCAG 2.1 Ref
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <a
              href="https://github.com/dequelabs/axe-core"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              axe-core
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Gradient Background */}
      <div className={styles.heroBg} aria-hidden="true">
        <div className={styles.heroBgOrb1}></div>
        <div className={styles.heroBgOrb2}></div>
        <div className={styles.heroBgGrid}></div>
      </div>

      {/* Main Content */}
      <main id="main-content" className={styles.main}>
        <div className={styles.container}>
          {/* URL Input Form */}
          <UrlForm onScan={handleScan} isLoading={isLoading} />

          {/* Results Section */}
          <div
            ref={resultsRef}
            aria-live="polite"
            aria-atomic="false"
            className={styles.results}
          >
            {/* Loading State */}
            {isLoading && <Loader url={scannedUrl} />}

            {/* Error State */}
            {!isLoading && error && (
              <ErrorMessage error={error} onDismiss={() => setError(null)} />
            )}

            {/* Report */}
            {!isLoading && report && (
              <div className={styles.reportSection}>
                <SummaryCards summary={report.summary} url={report.url} />
                <div className={styles.divider} aria-hidden="true" />
                <ViolationList
                  violations={report.violations}
                  report={report}
                  onDownload={handleDownload}
                />

                {/* Scan metadata */}
                <footer className={styles.reportMeta}>
                  <p>
                    Scanned with{' '}
                    <strong>
                      {report.testEngine?.name || 'axe-core'}{' '}
                      {report.testEngine?.version || ''}
                    </strong>{' '}
                    on{' '}
                    <time dateTime={report.scannedAt}>
                      {new Date(report.scannedAt).toLocaleString()}
                    </time>
                  </p>
                  <p>
                    {report.summary.inapplicable || 0} rules were not applicable to this page.
                  </p>
                </footer>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer} role="contentinfo">
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            Built with{' '}
            <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">Next.js</a>
            {' '}·{' '}
            <a href="https://www.deque.com/axe/" target="_blank" rel="noopener noreferrer">axe-core</a>
            {' '}·{' '}
            <a href="https://pptr.dev" target="_blank" rel="noopener noreferrer">Puppeteer</a>
          </p>
          <p className={styles.footerNote}>
            Automated scanning finds ~57% of accessibility issues. Always complement with manual testing.
          </p>
        </div>
      </footer>
    </div>
  );
}
