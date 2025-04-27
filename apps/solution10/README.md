# Solution for Chapter 10: Media & Non-Text Scraping

This directory contains a skeleton solution for the Media & Non-Text Scraping challenge. Your task is to implement a scraper that extracts various types of media from the Digital Archive website created for this chapter.

## Challenge Overview

The challenge consists of four main components:

1. **Image Gallery Scraping**: Extract images along with their metadata
2. **PDF Document Processing**: Download and parse PDF documents
3. **Video Metadata Extraction**: Extract information about embedded videos
4. **OSINT Challenge**: Use HTTP headers to verify the actual creation date of the content

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Ensure the Digital Archive website is running (from apps/chapter10):
   ```bash
   cd ../chapter10
   npm install
   npm run dev
   ```

3. Implement your solution in `index.ts`

4. Run your solution:
   ```bash
   npm run scrape
   ```

## Implementation Guidance

### 1. Image Gallery Scraping

Implement code to:
- Extract all images from the Gallery page
- Capture alt text, filenames, and captions
- Extract metadata from custom data attributes

### 2. PDF Document Processing

Implement code to:
- Download PDF files from the Documents page
- Extract text content from each PDF
- Parse any structured data (tables, references) found in the PDFs

### 3. Video Metadata Extraction

Implement code to:
- Identify and extract data from YouTube embeds, Vimeo embeds, and HTML5 video elements
- Capture video titles, descriptions, and source information

### 4. OSINT Challenge

Implement code to:
- Identify the claimed publication date from the website
- Use HTTP HEAD requests to check Last-Modified headers of images
- Calculate the actual date range of the content creation
- Compare the claimed and actual dates to detect discrepancies

## Expected Output

Your solution should generate output that matches the structure in `expected.json`, which includes:

- OSINT analysis results
- Image metadata with timestamps
- Document content and structure
- Video source information

## Helpful Resources

- [Axios Documentation](https://axios-http.com/docs/intro) for HTTP requests
- [Cheerio Documentation](https://cheerio.js.org/) for HTML parsing
- [pdf-parse Documentation](https://www.npmjs.com/package/pdf-parse) for PDF text extraction
- [Playwright Documentation](https://playwright.dev/docs/intro) for browser automation if needed