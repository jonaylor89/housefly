/**
 * Output formatting utilities for scraped data.
 * @module
 */

/**
 * Pretty-print a value as JSON to stdout.
 *
 * Keys are sorted alphabetically for deterministic output, and the JSON
 * is indented with 2 spaces for readability.
 *
 * @param data - Any JSON-serialisable value.
 *
 * @example
 * ```ts
 * printJson({ b: 2, a: 1 });
 * // stdout: { "a": 1, "b": 2 }
 * ```
 */
export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, Object.keys(data as Record<string, unknown>).sort(), 2));
}

/**
 * Escape a single CSV cell value.
 *
 * Wraps the value in double-quotes if it contains a comma, double-quote,
 * or newline. Internal double-quotes are escaped by doubling them.
 *
 * @param value - The raw cell value.
 * @returns The escaped string suitable for embedding in CSV.
 */
function escapeCsvValue(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert an array of objects to a CSV string with a header row.
 *
 * Values containing commas, double-quotes, or newlines are properly
 * quoted. If `columns` is not provided, the keys of the first row are
 * used as column headers.
 *
 * @param rows - Array of record objects to serialise.
 * @param columns - Optional explicit column list (controls order and filtering).
 * @returns A CSV-formatted string including the header row and a trailing newline.
 *
 * @example
 * ```ts
 * const csv = toCsv([
 *   { name: "Alice", age: 30 },
 *   { name: "Bob", age: 25 },
 * ]);
 * // "name,age\nAlice,30\nBob,25\n"
 * ```
 */
export function toCsv(
  rows: Record<string, unknown>[],
  columns?: string[],
): string {
  if (rows.length === 0) return "";

  const cols = columns ?? Object.keys(rows[0]!);
  const header = cols.map(escapeCsvValue).join(",");

  const body = rows
    .map((row) => cols.map((col) => escapeCsvValue(row[col])).join(","))
    .join("\n");

  return `${header}\n${body}\n`;
}

/**
 * Normalise a string for reliable comparison.
 *
 * Trims leading/trailing whitespace, converts `\r\n` to `\n`, and
 * collapses runs of whitespace into single spaces.
 *
 * @param str - The input string.
 * @returns The normalised string.
 *
 * @example
 * ```ts
 * normalizeForCompare("  hello \r\n  world  "); // "hello world"
 * ```
 */
export function normalizeForCompare(str: string): string {
  return str.replace(/\r\n/g, "\n").replace(/\s+/g, " ").trim();
}
