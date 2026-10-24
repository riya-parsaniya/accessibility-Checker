/**
 * formatReport.js
 * Transforms raw axe-core results into a clean, structured report.
 */

const IMPACT_ORDER = ['critical', 'serious', 'moderate', 'minor'];

/**
 * @param {object} axeResults - Raw results from axe.run()
 * @param {string} url - The scanned URL
 * @returns {object} Structured accessibility report
 */
export function formatReport(axeResults, url) {
  const violations = (axeResults.violations || [])
    .map((v) => formatViolation(v))
    .sort((a, b) => {
      const ai = IMPACT_ORDER.indexOf(a.impact);
      const bi = IMPACT_ORDER.indexOf(b.impact);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  const summary = buildSummary(violations, axeResults);

  return {
    url,
    scannedAt: new Date().toISOString(),
    summary,
    violations,
    testEngine: axeResults.testEngine || {},
    testEnvironment: axeResults.testEnvironment || {},
  };
}

/**
 * Formats a single axe violation into a clean structure.
 */
function formatViolation(violation) {
  return {
    id: violation.id,
    impact: violation.impact || 'unknown',
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    wcagTags: extractWcagTags(violation.tags || []),
    allTags: violation.tags || [],
    nodes: (violation.nodes || []).map((node) => ({
      html: node.html,
      target: node.target,
      failureSummary: node.failureSummary,
      any: (node.any || []).map((check) => ({
        id: check.id,
        message: check.message,
        impact: check.impact,
      })),
      all: (node.all || []).map((check) => ({
        id: check.id,
        message: check.message,
        impact: check.impact,
      })),
      none: (node.none || []).map((check) => ({
        id: check.id,
        message: check.message,
        impact: check.impact,
      })),
    })),
  };
}

/**
 * Extracts only WCAG-related tags (e.g., wcag2a, wcag21aa, best-practice)
 */
function extractWcagTags(tags) {
  return tags.filter(
    (tag) =>
      tag.startsWith('wcag') ||
      tag === 'best-practice' ||
      tag === 'section508' ||
      tag.startsWith('cat.')
  );
}

/**
 * Builds the summary object from violations and axe results.
 */
function buildSummary(violations, axeResults) {
  const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const v of violations) {
    if (counts[v.impact] !== undefined) {
      counts[v.impact]++;
    }
  }

  return {
    total: violations.length,
    critical: counts.critical,
    serious: counts.serious,
    moderate: counts.moderate,
    minor: counts.minor,
    passes: (axeResults.passes || []).length,
    incomplete: (axeResults.incomplete || []).length,
    inapplicable: (axeResults.inapplicable || []).length,
  };
}
