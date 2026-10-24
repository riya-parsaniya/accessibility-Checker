/**
 * URL Validation and Safety Checks
 * Prevents SSRF attacks by blocking private IP ranges and file:// URLs
 */

const PRIVATE_IP_PATTERNS = [
  // Loopback
  /^127\./,
  /^::1$/,
  /^localhost$/i,
  // Private Class A
  /^10\./,
  // Private Class B (172.16.0.0 – 172.31.255.255)
  /^172\.(1[6-9]|2[0-9]|3[01])\./,
  // Private Class C
  /^192\.168\./,
  // Link-local
  /^169\.254\./,
  // IPv6 private
  /^fc00:/i,
  /^fd[0-9a-f]{2}:/i,
  // Multicast
  /^224\./,
  /^ff[0-9a-f]{2}:/i,
];

/**
 * Validates and sanitizes a URL for scanning.
 * @param {string} input - Raw URL input from user
 * @returns {{ valid: boolean, url: string|null, error: string|null }}
 */
export function validateUrl(input) {
  if (!input || typeof input !== 'string') {
    return { valid: false, url: null, error: 'URL is required.' };
  }

  let raw = input.trim();

  if (!raw) {
    return { valid: false, url: null, error: 'URL cannot be empty.' };
  }

  // Block file:// and other non-http schemes explicitly
  if (/^(file|ftp|data|javascript|vbscript):\/\//i.test(raw)) {
    return {
      valid: false,
      url: null,
      error: 'Only http:// and https:// URLs are allowed.',
    };
  }

  // Auto-prepend https:// if no protocol given
  if (!/^https?:\/\//i.test(raw)) {
    raw = 'https://' + raw;
  }

  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return { valid: false, url: null, error: 'Invalid URL format.' };
  }

  // Only http and https
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return {
      valid: false,
      url: null,
      error: 'Only http:// and https:// URLs are allowed.',
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block private/loopback hostnames and IPs
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return {
        valid: false,
        url: null,
        error: 'Scanning private or local network addresses is not allowed.',
      };
    }
  }

  // Block non-standard ports that could indicate internal services
  const port = parsed.port ? parseInt(parsed.port, 10) : null;
  if (port && (port < 80 || (port > 443 && port < 1024))) {
    return {
      valid: false,
      url: null,
      error: 'Non-standard ports below 1024 are not allowed.',
    };
  }

  // Must have a valid TLD (at least one dot in hostname)
  if (!hostname.includes('.') && hostname !== 'localhost') {
    return {
      valid: false,
      url: null,
      error: 'Please enter a valid domain name (e.g., example.com).',
    };
  }

  return { valid: true, url: parsed.toString(), error: null };
}
