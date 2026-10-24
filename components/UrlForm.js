'use client';

import { useState } from 'react';
import styles from './UrlForm.module.css';

const EXAMPLE_URLS = [
  { label: 'Wikipedia', url: 'https://en.wikipedia.org' },
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'BBC News', url: 'https://www.bbc.com/news' },
  { label: 'W3C', url: 'https://www.w3.org' },
];

export default function UrlForm({ onScan, isLoading }) {
  const [url, setUrl] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setInputError('Please enter a URL to scan.');
      return;
    }
    setInputError('');
    onScan(trimmed);
  };

  const handleExampleClick = (exampleUrl) => {
    setUrl(exampleUrl);
    setInputError('');
    onScan(exampleUrl);
  };

  const handleChange = (e) => {
    setUrl(e.target.value);
    if (inputError) setInputError('');
  };

  return (
    <section className={styles.formSection} aria-labelledby="scan-heading">
      <div className={styles.heroText}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true"></span>
          WCAG 2.1 Compliant Auditing
        </div>
        <h1 id="scan-heading" className={styles.title}>
          Accessibility
          <span className={styles.titleGradient}> Checker</span>
        </h1>
        <p className={styles.subtitle}>
          Instantly audit any website for WCAG 2.0/2.1 compliance. Get detailed
          violation reports with actionable fix guidance powered by axe-core.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
        noValidate
        aria-label="Website accessibility scan form"
      >
        <div className={styles.inputGroup}>
          <label htmlFor="url-input" className={styles.label}>
            Website URL
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={handleChange}
              placeholder="https://example.com"
              className={`${styles.input} ${inputError ? styles.inputError : ''}`}
              disabled={isLoading}
              aria-describedby={inputError ? 'url-error' : 'url-hint'}
              aria-invalid={!!inputError}
              autoComplete="url"
              spellCheck="false"
            />
          </div>
          {inputError ? (
            <p id="url-error" className={styles.errorText} role="alert">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {inputError}
            </p>
          ) : (
            <p id="url-hint" className={styles.hintText}>
              Enter any public website URL. HTTPS is added automatically if missing.
            </p>
          )}
        </div>

        <button
          type="submit"
          className={styles.scanButton}
          disabled={isLoading}
          aria-label={isLoading ? 'Scanning in progress, please wait' : 'Scan website for accessibility issues'}
        >
          {isLoading ? (
            <>
              <span className={styles.buttonSpinner} aria-hidden="true"></span>
              Scanning…
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Scan Website
            </>
          )}
        </button>
      </form>

      <div className={styles.examples}>
        <p className={styles.examplesLabel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          Try an example:
        </p>
        <div className={styles.exampleButtons} role="list">
          {EXAMPLE_URLS.map(({ label, url: exUrl }) => (
            <button
              key={exUrl}
              type="button"
              className={styles.exampleBtn}
              onClick={() => handleExampleClick(exUrl)}
              disabled={isLoading}
              aria-label={`Scan ${label} (${exUrl})`}
              role="listitem"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
