export default {
  id: "chapter-10",
  title: "Media Extraction",
  targetUrl: "http://localhost:3010",
  output: { kind: "json" },
  hints: [
    "The site has separate pages: `/gallery.html` for images, `/documents.html` for PDFs, `/videos.html` for videos.",
    "Use cheerio to parse HTML and extract image metadata from `data-*` attributes and `figcaption` elements.",
    "Download PDFs and use `pdf-parse` to extract the page count for document entries.",
  ],
  checkpoints: [
    {
      id: "extract-images",
      description:
        "Extract image data including src, alt, filename, caption, and metadata",
    },
    {
      id: "extract-documents",
      description: "Extract document info and parse PDFs for page counts",
    },
    {
      id: "extract-videos",
      description:
        "Extract video data from YouTube iframes, Vimeo iframes, and local video elements",
    },
    {
      id: "combine-output",
      description: "Combine all media types into a single JSON output",
    },
  ],
} as const;
