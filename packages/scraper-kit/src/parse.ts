/**
 * HTML parsing helpers built on top of cheerio.
 * @module
 */

import * as cheerio from "cheerio";
import type { Cheerio, CheerioAPI, AnyNode } from "cheerio";

/**
 * Parse an HTML string and return a CheerioAPI instance.
 *
 * This is a thin wrapper around `cheerio.load` to keep imports centralised.
 *
 * @param body - Raw HTML string.
 * @returns A CheerioAPI root you can query with CSS selectors.
 *
 * @example
 * ```ts
 * const $ = loadHtml("<h1>Hello</h1>");
 * console.log($("h1").text()); // "Hello"
 * ```
 */
export function loadHtml(body: string): CheerioAPI {
  return cheerio.load(body);
}

/**
 * Extract the trimmed text content of a Cheerio element.
 *
 * @param el - A Cheerio selection.
 * @returns The text content with leading/trailing whitespace removed.
 *
 * @example
 * ```ts
 * const $ = loadHtml("<span>  hello  </span>");
 * text($("span")); // "hello"
 * ```
 */
export function text(el: Cheerio<AnyNode>): string {
  return el.text().trim();
}

/**
 * Extract an attribute value from a Cheerio element.
 *
 * Returns an empty string when the attribute is absent rather than
 * `undefined`, which simplifies downstream usage.
 *
 * @param el - A Cheerio selection.
 * @param name - The attribute name (e.g. `"href"`, `"src"`).
 * @returns The attribute value, or `""` if not present.
 *
 * @example
 * ```ts
 * const $ = loadHtml('<a href="/about">About</a>');
 * attr($("a"), "href"); // "/about"
 * ```
 */
export function attr(el: Cheerio<AnyNode>, name: string): string {
  return el.attr(name) ?? "";
}

/**
 * Extract a numeric value from the text content of a Cheerio element.
 *
 * Non-numeric characters (except digits, minus sign, and decimal point)
 * are stripped before parsing, so strings like `"$1,234.56"` are handled
 * correctly.
 *
 * @param el - A Cheerio selection whose text represents a number.
 * @returns The parsed number, or `NaN` if parsing fails.
 *
 * @example
 * ```ts
 * const $ = loadHtml("<td>$1,234</td>");
 * number($("td")); // 1234
 * ```
 */
export function number(el: Cheerio<AnyNode>): number {
  const raw = el.text().replace(/[^0-9.\-]/g, "");
  return parseFloat(raw);
}

/**
 * Collapse all runs of whitespace (spaces, tabs, newlines) into a single
 * space, and trim leading/trailing whitespace.
 *
 * Useful for normalising scraped text before comparison or storage.
 *
 * @param str - The input string.
 * @returns The whitespace-collapsed string.
 *
 * @example
 * ```ts
 * trimAll("  hello   world\n"); // "hello world"
 * ```
 */
export function trimAll(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}
