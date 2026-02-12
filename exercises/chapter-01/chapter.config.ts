export default {
  id: "chapter-01",
  title: "Hello World Scraping",
  targetUrl: "http://localhost:3001",
  output: { kind: "txt" },
  hints: [
    "Start by fetching the page content using `fetch()`. Remember that `fetch()` returns a Response object — you'll need to call `.text()` on it to get the HTML string.",
    "Once you have the HTML string, load it into cheerio using `cheerio.load(body)`. This gives you a jQuery-like `$` function you can use to query the DOM.",
    "Look at the page structure — the text you need to extract is inside `<p>` tags. Use `$(\"p\").text()` to get the text content of all paragraph elements.",
    "Don't forget to `console.log()` the extracted text so it appears in stdout. The checker compares your stdout output against the expected file.",
  ],
  checkpoints: [
    { id: "fetch", description: "Fetch the page HTML" },
    { id: "parse", description: "Parse HTML with cheerio" },
    { id: "extract", description: "Extract text from <p> tag" },
  ],
} as const;
