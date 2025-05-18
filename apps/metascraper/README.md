# MetaScraper: Large-Scale & Unstructured Web Crawling

MetaScraper is a demonstration of large-scale and unstructured web crawling concepts for Chapter 7 of the Housefly web scraping tutorial. It crawls across all previous chapter demos, extracts structured data using AI, and builds a searchable index.

## Features

- **Multi-Site Crawling**: Crawls all previous Housefly chapter websites
- **AI-Assisted Parsing**: Uses Claude AI to extract structured data from messy content
- **Search Engine Functionality**: Indexes content and provides search capabilities
- **Scalable Architecture**: Demonstrates concepts for large-scale crawling

## Getting Started

1. Make sure you have an Anthropic API key in your `.env` file (see `.env.template`)
2. Install dependencies:

```bash
npm install
```

3. Run the crawler to build the search index:

```bash
npm start -- crawl
```

4. Search the index:

```bash
npm start -- search "your search query here"
```

## How It Works

### Crawling Process

1. The crawler starts with seed URLs from all previous chapter websites
2. For each page, it extracts content, discovers links, and follows them
3. It uses Playwright for browser automation to handle JavaScript-rendered content
4. Every page is processed to extract text, keywords, and metadata

### AI-Assisted Parsing

The crawler uses Claude AI to:

1. Analyze unstructured content from each page
2. Extract meaningful structured data regardless of HTML structure
3. Identify key elements and relationships in the content

### Search Indexing

1. All crawled content is indexed with its metadata
2. A simple search function ranks results based on keyword matching
3. Results include page titles, URLs, and content previews

## Project Structure

- `index.ts`: Main crawler and search engine implementation
- `data/search_index.json`: Generated search index (after crawling)
- `data/stats.json`: Crawling statistics and metrics

## Learning Concepts

This project demonstrates several advanced web scraping concepts:

- Handling multiple websites with different structures
- Scaling crawling operations across many pages
- Using AI to extract meaningful data from unstructured content
- Building search functionality on top of crawled data
- Managing crawl scope and respecting website boundaries

## Extending the Project

Some ways to extend this project:

1. Implement distributed crawling with worker processes
2. Add more sophisticated ranking algorithms for search
3. Implement a web UI for searching the index
4. Add content clustering and categorization features
5. Implement incremental crawling to update the index