import styles from './Loader.module.css';

const STEPS = [
  { icon: '🌐', text: 'Launching headless browser…' },
  { icon: '📄', text: 'Rendering page content…' },
  { icon: '♿', text: 'Running axe-core WCAG analysis…' },
  { icon: '📊', text: 'Structuring the report…' },
];

export default function Loader({ url }) {
  return (
    <div
      className={styles.wrapper}
      role="status"
      aria-live="polite"
      aria-label="Scanning website for accessibility issues"
    >
      <div className={styles.card}>
        {/* Animated Ring */}
        <div className={styles.ringWrapper} aria-hidden="true">
          <div className={styles.ring}>
            <div className={styles.ringInner}></div>
          </div>
          <div className={styles.ringIcon}>♿</div>
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>Scanning for Accessibility Issues</h2>
          {url && (
            <p className={styles.url}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {url}
            </p>
          )}

          {/* Progress Steps */}
          <ul className={styles.steps} aria-label="Scan progress steps">
            {STEPS.map((step, i) => (
              <li
                key={i}
                className={styles.step}
                style={{ animationDelay: `${i * 0.8}s` }}
              >
                <span className={styles.stepIcon} aria-hidden="true">{step.icon}</span>
                <span className={styles.stepText}>{step.text}</span>
                <span className={styles.stepDots} aria-hidden="true">
                  <span></span><span></span><span></span>
                </span>
              </li>
            ))}
          </ul>

          <p className={styles.note}>
            This may take up to 30 seconds for complex pages.
          </p>
        </div>
      </div>
    </div>
  );
}
