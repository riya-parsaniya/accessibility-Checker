import styles from './SummaryCards.module.css';

const IMPACT_CONFIG = {
  critical: {
    label: 'Critical',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    colorVar: 'critical',
  },
  serious: {
    label: 'Serious',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    colorVar: 'serious',
  },
  moderate: {
    label: 'Moderate',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    colorVar: 'moderate',
  },
  minor: {
    label: 'Minor',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    colorVar: 'minor',
  },
};

export default function SummaryCards({ summary, url }) {
  if (!summary) return null;

  const { total, critical, serious, moderate, minor, passes, incomplete } = summary;

  return (
    <section className={styles.section} aria-labelledby="summary-heading">
      <div className={styles.header}>
        <div>
          <h2 id="summary-heading" className={styles.heading}>
            Scan Results
          </h2>
          <p className={styles.scannedUrl}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {url}
          </p>
        </div>
        <div className={styles.totalBadge} aria-label={`${total} total violations found`}>
          <span className={styles.totalNumber}>{total}</span>
          <span className={styles.totalLabel}>Total Violations</span>
        </div>
      </div>

      <div className={styles.grid} role="list" aria-label="Violations by impact level">
        {Object.entries(IMPACT_CONFIG).map(([impact, config]) => {
          const count = { critical, serious, moderate, minor }[impact];
          return (
            <article
              key={impact}
              className={`${styles.card} ${styles[`card--${impact}`]}`}
              role="listitem"
              aria-label={`${count} ${config.label} violations`}
            >
              <div className={styles.cardIcon}>{config.icon}</div>
              <div className={styles.cardBody}>
                <span className={styles.cardCount}>{count}</span>
                <span className={styles.cardLabel}>{config.label}</span>
              </div>
              {count > 0 && (
                <div className={styles.cardIndicator} aria-hidden="true" />
              )}
            </article>
          );
        })}
      </div>

      <div className={styles.statsRow} aria-label="Additional scan statistics">
        <div className={styles.stat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className={styles.statValue} style={{ color: 'var(--color-pass)' }}>
            {passes}
          </span>
          <span className={styles.statLabel}>Passed rules</span>
        </div>
        <div className={styles.statDivider} aria-hidden="true" />
        <div className={styles.stat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
          </svg>
          <span className={styles.statValue} style={{ color: 'var(--color-moderate)' }}>
            {incomplete}
          </span>
          <span className={styles.statLabel}>Need review</span>
        </div>
        {total === 0 && (
          <>
            <div className={styles.statDivider} aria-hidden="true" />
            <div className={styles.stat}>
              <span className={styles.allClearBadge} role="status">
                🎉 No violations found!
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
