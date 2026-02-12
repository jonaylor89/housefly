# Chapter 11: Polite Scraping

## Hint 1
Start by fetching and parsing `/robots.txt`. Look for `User-Agent`, `Allow`, `Disallow`, and `Crawl-delay` directives. Pay special attention to rules for the `GoodBot` user agent.

## Hint 2
Set your `User-Agent` header to `"GoodBot"` and include an `X-Robots-Check: GoodBot` header in your requests. The server checks these to grant access to restricted endpoints.

## Hint 3
The site has a CAPTCHA challenge at `/api/captcha/generate`. It returns a math problem (e.g., "5 + 3") and a token. Solve the math, then POST the solution and token to `/api/captcha/verify`.

## Hint 4
Implement retry logic with exponential backoff for rate-limited responses (HTTP 429). Check the `Retry-After` header to know how long to wait. Respect the `Crawl-delay` from robots.txt between requests.

## Hint 5
Fetch public market data from `/api/market/public`, then order books from `/api/orderbook/restricted` (requires auth + GoodBot header) or fall back to `/api/orderbook/public`. Only keep the `timestamp` field from order book responses.
