# Chapter 7: API Pagination

## Hint 1
The API endpoint is at `/api/products` and accepts `page` and `limit` query parameters. Start by fetching page 1 to discover how many total pages exist.

## Hint 2
The API response includes `totalPages` and `currentPage` fields. Use `totalPages` from the first response to know when to stop paginating.

## Hint 3
Implement a `while` loop that increments `currentPage` and fetches each page until `currentPage > totalPages`. Accumulate all products in an array.

## Hint 4
Handle edge cases: check if `response.ok` before parsing JSON, handle empty product arrays, and consider stopping early if a page within the expected range returns no products.

## Hint 5
Use `console.error()` for progress logging (not `console.log()`) since stdout is used for the actual CSV output. The `formatCsvValue` helper is already provided — use it for string fields that might contain commas or quotes.
