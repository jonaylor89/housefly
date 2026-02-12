/**
 * HTTP utilities for polite, retry-aware web scraping.
 * @module
 */

/** Default user-agent sent with every request. */
const DEFAULT_USER_AGENT = "Housefly/1.0 (educational scraper)";

/** Default delay in milliseconds between requests. */
const DEFAULT_DELAY_MS = 100;

/** Timestamp of the last request, used to enforce polite delays. */
let lastRequestTime = 0;

/**
 * Wait until at least `ms` milliseconds have elapsed since the last request.
 * This prevents overwhelming target servers.
 *
 * @param ms - Minimum milliseconds to wait between requests.
 */
async function politeDelay(ms: number): Promise<void> {
  const elapsed = Date.now() - lastRequestTime;
  if (elapsed < ms) {
    await new Promise((resolve) => setTimeout(resolve, ms - elapsed));
  }
  lastRequestTime = Date.now();
}

/**
 * Merge the default polite headers with any caller-supplied headers.
 *
 * @param init - Optional RequestInit whose headers will be merged.
 * @returns A new Headers object with defaults applied.
 */
function mergeHeaders(init?: RequestInit): Headers {
  const headers = new Headers(init?.headers);
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", DEFAULT_USER_AGENT);
  }
  return headers;
}

/**
 * Fetch a URL and return its body as a string.
 *
 * Applies the default polite user-agent header and a configurable delay
 * between consecutive requests.
 *
 * @param url - The URL to fetch.
 * @param init - Optional standard `RequestInit` overrides.
 * @param delayMs - Minimum delay between requests (default 100 ms).
 * @returns The response body as a string.
 *
 * @example
 * ```ts
 * const html = await fetchText("https://example.com");
 * ```
 */
export async function fetchText(
  url: string,
  init?: RequestInit,
  delayMs = DEFAULT_DELAY_MS,
): Promise<string> {
  await politeDelay(delayMs);
  const res = await fetch(url, { ...init, headers: mergeHeaders(init) });
  if (!res.ok) {
    throw new Error(`fetchText ${url}: HTTP ${res.status} ${res.statusText}`);
  }
  return res.text();
}

/**
 * Fetch a URL and return the response body parsed as JSON.
 *
 * Applies the default polite user-agent header and a configurable delay
 * between consecutive requests.
 *
 * @typeParam T - The expected shape of the parsed JSON.
 * @param url - The URL to fetch.
 * @param init - Optional standard `RequestInit` overrides.
 * @param delayMs - Minimum delay between requests (default 100 ms).
 * @returns The parsed JSON value.
 *
 * @example
 * ```ts
 * interface ApiResponse { items: string[] }
 * const data = await fetchJson<ApiResponse>("https://api.example.com/items");
 * ```
 */
export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
  delayMs = DEFAULT_DELAY_MS,
): Promise<T> {
  await politeDelay(delayMs);
  const headers = mergeHeaders(init);
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    throw new Error(`fetchJson ${url}: HTTP ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Options for {@link fetchWithRetry}.
 */
export interface FetchWithRetryOptions {
  /** Maximum number of retry attempts (default 3). */
  retries?: number;
  /** Initial backoff in milliseconds; doubles on each retry (default 1000). */
  backoff?: number;
  /** HTTP status codes that trigger a retry (default [429, 500, 502, 503]). */
  retryOn?: number[];
  /** Optional standard `RequestInit` overrides. */
  init?: RequestInit;
}

/**
 * Fetch a URL with exponential-backoff retry logic.
 *
 * Retries the request when the response status matches one of the
 * `retryOn` codes. The delay doubles after every failed attempt
 * (exponential backoff).
 *
 * @param url - The URL to fetch.
 * @param options - Retry behaviour configuration.
 * @returns The successful `Response`.
 * @throws When all retries are exhausted or a non-retryable error occurs.
 *
 * @example
 * ```ts
 * const res = await fetchWithRetry("https://example.com/api", {
 *   retries: 5,
 *   backoff: 500,
 *   retryOn: [429, 503],
 * });
 * ```
 */
export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {},
): Promise<Response> {
  const {
    retries = 3,
    backoff = 1000,
    retryOn = [429, 500, 502, 503],
    init,
  } = options;

  let lastError: Error | undefined;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      const delay = backoff * 2 ** (attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      const res = await fetch(url, { ...init, headers: mergeHeaders(init) });

      if (retryOn.includes(res.status) && attempt < retries) {
        lastError = new Error(
          `fetchWithRetry ${url}: HTTP ${res.status} (attempt ${attempt + 1}/${retries + 1})`,
        );
        continue;
      }

      return res;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt >= retries) break;
    }
  }

  throw lastError ?? new Error(`fetchWithRetry ${url}: all retries exhausted`);
}
