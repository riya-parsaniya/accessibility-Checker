import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;

  return (
    <div
      className={styles.wrapper}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={styles.card}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>Scan Failed</h3>
          <p className={styles.message}>{error}</p>
          <div className={styles.tips}>
            <p className={styles.tipsTitle}>Common reasons:</p>
            <ul className={styles.tipsList}>
              <li>The website may be down or blocking automated requests</li>
              <li>The URL may be incorrect — check for typos</li>
              <li>The page may have taken too long to load</li>
              <li>SSL/certificate issues with the target site</li>
            </ul>
          </div>
        </div>
        <button
          className={styles.closeBtn}
          onClick={onDismiss}
          aria-label="Dismiss error message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
