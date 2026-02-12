/**
 * @housefly/scraper-kit — shared scraping utilities.
 *
 * Re-exports every public API so consumers can import from a single
 * entry-point:
 *
 * ```ts
 * import { fetchText, loadHtml, printJson } from "@housefly/scraper-kit";
 * ```
 *
 * Sub-path imports are also available for tree-shaking or clarity:
 *
 * ```ts
 * import { fetchWithRetry } from "@housefly/scraper-kit/http";
 * ```
 *
 * @module
 */

export { fetchText, fetchJson, fetchWithRetry } from "./src/http.js";
export type { FetchWithRetryOptions } from "./src/http.js";

export { loadHtml, text, attr, number, trimAll } from "./src/parse.js";

export { printJson, toCsv, normalizeForCompare } from "./src/output.js";

export { withPlaywright } from "./src/browser.js";
export type { WithPlaywrightOptions } from "./src/browser.js";

export { debug, info } from "./src/logging.js";
