/**
 * Minimal logging utilities that write to stderr to keep stdout clean
 * for scraped data output.
 * @module
 */

/**
 * Log a debug message to stderr.
 *
 * Output is suppressed unless the `DEBUG` environment variable is set to
 * `"1"`. This lets you sprinkle debug calls throughout scraper code
 * without polluting normal output.
 *
 * @param args - Values to log (same signature as `console.error`).
 *
 * @example
 * ```ts
 * debug("Fetching page", url);
 * // Only prints when DEBUG=1
 * ```
 */
export function debug(...args: unknown[]): void {
  if (process.env.DEBUG === "1") {
    console.error("[DEBUG]", ...args);
  }
}

/**
 * Log an informational message to stderr.
 *
 * Always prints regardless of environment variables. Use this for
 * progress messages that should be visible during normal operation but
 * must not contaminate stdout (which is reserved for scraped data).
 *
 * @param args - Values to log (same signature as `console.error`).
 *
 * @example
 * ```ts
 * info("Scraping page 3 of 10…");
 * ```
 */
export function info(...args: unknown[]): void {
  console.error("[INFO]", ...args);
}
