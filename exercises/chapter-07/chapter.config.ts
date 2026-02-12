export default {
  id: "chapter-07",
  title: "API Pagination",
  targetUrl: "http://localhost:3007",
  output: { kind: "csv" },
  hints: [
    "The API endpoint is at `/api/products` and accepts `page` and `limit` query parameters.",
    "Use `totalPages` from the first API response to know when to stop paginating.",
    "Implement a `while` loop that fetches each page and accumulates products into an array.",
  ],
  checkpoints: [
    { id: "fetch-first-page", description: "Successfully fetch the first page of products from the API" },
    { id: "discover-total-pages", description: "Extract totalPages from the first response to determine pagination bounds" },
    { id: "paginate-all", description: "Loop through all pages and collect every product" },
    { id: "output-csv", description: "Output all products as properly formatted CSV to stdout" },
  ],
} as const;
