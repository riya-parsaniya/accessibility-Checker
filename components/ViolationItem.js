'use client';

import { useState } from 'react';
import styles from './ViolationItem.module.css';

const IMPACT_LABELS = {
  critical: { label: 'Critical', colorClass: 'critical' },
  serious: { label: 'Serious', colorClass: 'serious' },
  moderate: { label: 'Moderate', colorClass: 'moderate' },
  minor: { label: 'Minor', colorClass: 'minor' },
};

export default function ViolationItem({ violation, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllNodes, setShowAllNodes] = useState(false);

  const { id, impact, description, help, helpUrl, wcagTags, nodes } = violation;
  const impactConfig = IMPACT_LABELS[impact] || { label: impact, colorClass: 'minor' };
  const itemId = `violation-${id}-${index}`;
  const panelId = `panel-${id}-${index}`;

  const displayedNodes = showAllNodes ? nodes : nodes.slice(0, 3);

  return (
    <article
      className={`${styles.item} ${styles[`item--${impactConfig.colorClass}`]}`}
      aria-labelledby={`${itemId}-title`}
    >
      {/* Collapse/Expand Header */}
      <button
        className={styles.header}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        id={`${itemId}-btn`}
      >
        <div className={styles.headerLeft}>
          <span
            className={`${styles.impactBadge} ${styles[`badge--${impactConfig.colorClass}`]}`}
            aria-label={`Impact: ${impactConfig.label}`}
          >
            {impactConfig.label}
          </span>
          <div className={styles.titleGroup}>
            <span className={styles.ruleId} id={`${itemId}-title`}>{id}</span>
            <span className={styles.helpText}>{help}</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <span className={styles.nodeCount} aria-label={`${nodes.length} affected element${nodes.length !== 1 ? 's' : ''}`}>
            {nodes.length} element{nodes.length !== 1 ? 's' : ''}
          </span>
          <svg
            className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          id={panelId}
          className={styles.panel}
          role="region"
          aria-labelledby={`${itemId}-btn`}
        >
          {/* Description */}
          <div className={styles.infoGrid}>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                Description
              </span>
              <p className={styles.infoText}>{description}</p>
            </div>

            {/* WCAG Tags */}
            {wcagTags && wcagTags.length > 0 && (
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                    <line x1="7" y1="7" x2="7.01" y2="7" />
                  </svg>
                  WCAG Tags
                </span>
                <div className={styles.tags} aria-label="WCAG criteria">
                  {wcagTags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Link */}
          {helpUrl && (
            <a
              href={helpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.helpLink}
              aria-label={`Learn how to fix: ${help} (opens in new tab)`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              How to fix this issue
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          )}

          {/* Affected Elements */}
          <div className={styles.nodesSection}>
            <h4 className={styles.nodesSectionTitle}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              Affected Elements ({nodes.length})
            </h4>
            <ol className={styles.nodeList}>
              {displayedNodes.map((node, ni) => (
                <li key={ni} className={styles.node}>
                  {/* CSS Selector */}
                  {node.target && node.target.length > 0 && (
                    <div className={styles.nodeTarget}>
                      <span className={styles.nodeTargetLabel}>CSS Selector</span>
                      <code className={styles.selector}>
                        {Array.isArray(node.target) ? node.target.join(', ') : node.target}
                      </code>
                    </div>
                  )}

                  {/* HTML Snippet */}
                  {node.html && (
                    <div className={styles.nodeHtml}>
                      <span className={styles.nodeTargetLabel}>HTML</span>
                      <code className={styles.htmlSnippet}>{node.html}</code>
                    </div>
                  )}

                  {/* Failure Summary */}
                  {node.failureSummary && (
                    <div className={styles.failureSummary}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <p>{node.failureSummary}</p>
                    </div>
                  )}
                </li>
              ))}
            </ol>

            {nodes.length > 3 && (
              <button
                className={styles.showMoreBtn}
                onClick={() => setShowAllNodes(!showAllNodes)}
                aria-expanded={showAllNodes}
              >
                {showAllNodes
                  ? `Show fewer elements`
                  : `Show ${nodes.length - 3} more element${nodes.length - 3 !== 1 ? 's' : ''}`}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: showAllNodes ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
