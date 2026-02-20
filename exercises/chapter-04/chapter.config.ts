export default {
  id: "chapter-04",
  title: "Dynamic Content",
  targetUrl: "http://localhost:3004",
  output: { kind: "csv" },
  hints: [
    "This page renders its content with JavaScript, so `fetch()` + cheerio won't work — the HTML returned by fetch won't have the dynamic content. You need a real browser via Playwright.",
    'After navigating to the page with `page.goto(URI)`, you need to wait for the dynamic content to load. Use `page.waitForSelector(".news-item")` to wait until news items appear in the DOM.',
    'Use `page.$$eval(".news-item", items => ...)` to extract data from all matching elements at once. Inside the callback, you can use standard DOM APIs like `querySelector`, `textContent`, and `getAttribute`.',
    'For each news item, extract: the title from `h2`, the content from `p`, the author from `.meta span` (removing the "By " prefix), and the timestamp from the `datetime` attribute on `<time>`.',
    "Format the output as CSV with the header `title,content,author,timestamp`. Wrap each value in double quotes to handle commas or special characters in the text.",
  ],
  checkpoints: [
    { id: "browser", description: "Launch browser and navigate" },
    { id: "wait", description: "Wait for dynamic content" },
    { id: "extract", description: "Extract news item fields" },
    { id: "format", description: "Output as quoted CSV" },
  ],
} as const;
