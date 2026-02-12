/**
 * Playwright browser helpers with automatic lifecycle management.
 * @module
 */

import type { Browser, Page } from "playwright";

/**
 * Options for {@link withPlaywright}.
 */
export interface WithPlaywrightOptions {
  /** Run the browser in headless mode (default `true`). */
  headless?: boolean;
  /** Slow down each Playwright operation by this many milliseconds (default `0`). */
  slowMo?: number;
}

/**
 * Launch a Playwright Chromium browser, create a page, execute a callback,
 * and guarantee the browser is closed afterwards — even if an error occurs.
 *
 * Playwright is loaded via a dynamic `import()` so that it remains an
 * optional dependency; the module can be imported without Playwright
 * installed as long as this function is never called.
 *
 * @typeParam T - The return type of the callback.
 * @param fn - An async function that receives the `Page` and `Browser`.
 * @param options - Optional browser-launch settings.
 * @returns The value returned by `fn`.
 *
 * @example
 * ```ts
 * const title = await withPlaywright(async (page) => {
 *   await page.goto("https://example.com");
 *   return page.title();
 * });
 * ```
 */
export async function withPlaywright<T>(
  fn: (page: Page, browser: Browser) => Promise<T>,
  options: WithPlaywrightOptions = {},
): Promise<T> {
  const { headless = true, slowMo = 0 } = options;

  // Dynamic import so playwright is not required at module-load time.
  const { chromium } = await import("playwright");

  const browser = await chromium.launch({ headless, slowMo });
  try {
    const page = await browser.newPage();
    return await fn(page, browser);
  } finally {
    await browser.close();
  }
}
