'use client';

import { useState, useMemo } from 'react';
import ViolationItem from './ViolationItem';
import styles from './ViolationList.module.css';

const IMPACT_FILTERS = [
  { value: 'all', label: 'All Issues' },
  { value: 'critical', label: 'Critical' },
  { value: 'serious', label: 'Serious' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'minor', label: 'Minor' },
];

export default function ViolationList({ violations, report, onDownload }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredViolations = useMemo(() => {
    if (activeFilter === 'all') return violations;
    return violations.filter((v) => v.impact === activeFilter);
  }, [violations, activeFilter]);

  const counts = useMemo(() => {
    const c = { all: violations.length, critical: 0, serious: 0, moderate: 0, minor: 0 };
    for (const v of violations) {
      if (c[v.impact] !== undefined) c[v.impact]++;
    }
    return c;
  }, [violations]);

  if (!violations || violations.length === 0) {
    return (
      <section className={styles.emptyState} aria-label="No violations found">
        <div className={styles.emptyIcon} aria-hidden="true">✅</div>
        <h3 className={styles.emptyTitle}>No Violations Found!</h3>
        <p className={styles.emptySubtitle}>
          This page passed all checked WCAG 2.0/2.1 A and AA rules. Great work!
        </p>
        <button className={styles.downloadBtn} onClick={onDownload}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Full Report
        </button>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-labelledby="violations-heading">
      <div className={styles.toolbar}>
        <h3 id="violations-heading" className={styles.heading}>
          Violations
          <span className={styles.headingCount} aria-label={`${violations.length} total`}>
            {violations.length}
          </span>
        </h3>

        <div className={styles.controls}>
          {/* Filter Tabs */}
          <div className={styles.filters} role="tablist" aria-label="Filter violations by impact">
            {IMPACT_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                role="tab"
                aria-selected={activeFilter === value}
                className={`${styles.filterBtn} ${activeFilter === value ? styles.filterActive : ''} ${value !== 'all' ? styles[`filter--${value}`] : ''}`}
                onClick={() => setActiveFilter(value)}
                aria-label={`Show ${label} violations (${counts[value]})`}
              >
                {label}
                <span className={styles.filterCount}>{counts[value]}</span>
              </button>
            ))}
          </div>

          {/* Download Button */}
          <button
            className={styles.downloadBtn}
            onClick={onDownload}
            aria-label="Download full accessibility report as JSON"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download JSON
          </button>
        </div>
      </div>

      {filteredViolations.length === 0 ? (
        <div className={styles.emptyFilter} role="status">
          No <strong>{activeFilter}</strong> violations found.
        </div>
      ) : (
        <ol
          className={styles.list}
          aria-label={`${filteredViolations.length} accessibility violation${filteredViolations.length !== 1 ? 's' : ''}`}
        >
          {filteredViolations.map((violation, i) => (
            <li key={`${violation.id}-${i}`}>
              <ViolationItem violation={violation} index={i} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
