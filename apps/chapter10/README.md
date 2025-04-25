# Chapter 10: Media & Non-Text Scraping

Welcome to Chapter 10 of Housefly! This chapter focuses on scraping beyond just text content, exploring techniques for extracting media files and their metadata.

## Challenge Overview

In this chapter, you'll work with a "Digital Archive" website that contains various media types:

1. **Image Gallery**: Various historical images with metadata
2. **Document Library**: PDF documents with different content structures
3. **Video Collection**: Embedded videos from different sources

## Your Task

Create a scraper that extracts:

1. **From the Image Gallery:**
   - Image sources (URLs)
   - Alt text
   - Filenames
   - Captions (where available)
   - Additional metadata attributes

2. **From the Document Library:**
   - Download PDF files
   - Extract textual content
   - Parse structured data (tables, references) from PDFs

3. **From the Video Collection:**
   - Video titles and descriptions
   - Video source URLs/IDs
   - Platform information (YouTube, Vimeo, etc.)

## Getting Started

1. Start the Chapter 10 website:
   ```sh
   cd apps/chapter10
   npm install
   npm run dev
   ```

2. Navigate to `http://localhost:5173` to explore the website

3. Implement your solution in the `solution10` directory:
   ```sh
   cd apps/solution10
   npm install
   # Edit index.ts to implement your solution
   npm run scrape
   ```

## Helpful Tools

For this challenge, consider using:

- **Cheerio** for HTML parsing
- **Axios** for downloading files
- **pdf-parse** for extracting text from PDFs
- **Playwright/Puppeteer** (optional) if you need to interact with dynamic elements

## Validation

Compare your output to the expected data structure in `expected.json`. Your solution should extract all required information in the same format.

## Tips

- Pay attention to custom data attributes in HTML elements
- Use appropriate error handling when downloading files
- Some PDFs may contain structured data (tables) that require special parsing
- Remember to handle cases where certain elements (like captions) might be missing

Good luck!