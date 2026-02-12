# Chapter 10: Media Extraction

## Hint 1
The site has three separate pages for different media types: `/gallery.html` for images, `/documents.html` for PDFs, and `/videos.html` for videos. Fetch and parse each one separately.

## Hint 2
For images, look for `.gallery-item` elements. Extract the `src`, `alt`, filename (using `path.basename()`), caption from `figcaption`, and metadata from `data-*` attributes like `data-photographer` and `data-location`.

## Hint 3
For documents, find `.document-item` elements. Get the PDF download URL from `a.btn[href]`, then fetch the PDF and parse it with `pdf-parse` to get the page count.

## Hint 4
For videos, handle three sources: YouTube iframes (extract videoId from embed URL), Vimeo iframes (extract videoId from embed URL), and local `<video>` elements (get src and type from `<source>`).

## Hint 5
Normalize whitespace in descriptions and captions using `.replace(/\s+/g, " ").trim()` to ensure consistent output matching.
