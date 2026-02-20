export default {
  id: "chapter-05",
  title: "Infinite Scroll",
  targetUrl: "http://localhost:3005",
  output: { kind: "csv" },
  hints: [
    "This page uses infinite scroll — content loads as you scroll down. You need to programmatically scroll the page to trigger loading of all photos before extracting data.",
    "Implement a scroll loop: get the current `document.body.scrollHeight`, scroll to the bottom with `window.scrollTo(0, document.body.scrollHeight)`, wait for new content to load, then check if the height changed. Stop when it doesn't.",
    "Use `page.waitForTimeout(1500)` between scrolls to give the page time to load new content. The loading delay is intentional — too fast and you'll miss items.",
    'Photo cards have class `.photo-card`. Extract the title from `h2`, photographer from `p` (remove "By " prefix), likes count from `.flex span` (remove "❤️ " prefix), and the image URL from the `img` `src` attribute.',
    'The image URLs are in the `src` attribute of the `img` elements — read them directly with `getAttribute("src")`.',
  ],
  checkpoints: [
    { id: "scroll", description: "Implement scroll-to-bottom loop" },
    { id: "detect-end", description: "Detect when all content loaded" },
    { id: "extract", description: "Extract photo card data" },
    { id: "decode-url", description: "Read image URLs from src attributes" },
  ],
} as const;
