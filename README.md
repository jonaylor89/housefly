
![Housefly Logo](/apps/tutorial/public/housefly-logo.png)

# Housefly: A Hands-On Web Scraping Playground

Housefly is an interactive learning project designed to teach web scraping through structured challenges. Each chapter includes a companion website built specifically to be scraped, allowing you to practice in a controlled environment.

## Features

* Realistic Web Scraping Challenges – Work with purpose-built websites.
* Structured Learning – Progress through guided exercises.
* Automated Solution Checking – Verify your scrapers against expected outputs.

## Getting Started

1. Clone the Repository

```sh
git clone https://github.com/yourusername/housefly.git
cd housefly
```

2. Navigate to Chapter 1

Each chapter contains a simple website to scrape, along with an `expected.txt` file defining the correct output.

3. Write Your Scraper

Implement your solution inside the corresponding `solution{number}/` directory.

4. Check Your Answer

Run the validation script to compare your scraper’s output against expected.txt:

```sh
# npx install playwright (optionally for some exercises)
npm run ca 1
```

5. Add Env Vars (Optional)

Some of the challenges require 3rd party apis e.g. OpenAI and for those, there is a `.env.template` file that you can fill in and rename to `.env` to use them

```
mv .env.template .env
```

## Project Structure

```
housefly/
├── apps/
│   ├── chapter1/  # Website for Chapter 1
│   │   ├── index.html
│   │   ├── package.json
│   ├── chapter2/
│   ├── chapter3/
│   ├── solution1/  # Place your Chapter 1 solution here
│   │   ├── expected.(txt, csv, json)
│   │   ├── index.ts
│   │   ├── package.json
├── scripts/
│   ├── check_answers.sh  # Script to validate solutions
```

## Roadmap

1. Basic HTML Scraping
- [x] Single static HTML file with simple text
- [x] Single HTML file with structured data (tables, lists, divs with classes)
- [x] Single HTML file with unstructured text requiring AI-based structuring (e.g., extracting key information from free-form text)

2. JavaScript-Rendered Content
- [x] Single-page site where content loads dynamically via JavaScript
- [x] Scraping sites with infinite scroll and lazy-loaded content

3. Multi-Page Crawling
- [x] multiple pages within the same subdomain (/content/*)
    - [x] storing data and duplicates (index of URL -> data)
    - [x] sitemap + link crawling
    - [x] Sitemap crawling and extracting internal links

4. Advanced Website Interaction and APIs
- [x] API-Driven Websites
  - [x] Extracting data from JSON responses in API-driven websites
  - [x] Scraping sites where data loads via AJAX calls
- [x] Forms and Authentication
  - [x] Automate form submissions (search, filters, logins)
  - [x] Handle authentication flows (cookies, tokens)
  - [x] Maintain sessions across requests
  - [x] Access protected content
- [x] Work with GraphQL APIs

5. Media & Non-Text Scraping
- [ ] Extracting images and metadata (alt text, filenames)
- [ ] Downloading and parsing PDFs
- [ ] Scraping embedded video metadata (YouTube, Vimeo)

6. Handling Web Crawling Defenses
- [ ] Rate limiting and polite crawling (respecting robots.txt)
- [ ] Handling CAPTCHAs with solver services
- [ ] Dealing with anti-scraping mechanisms (e.g., Cloudflare, bot traps)

7. Large-Scale & Unstructured Web Crawling
- [ ] Scraping random websites with different path structures and data formats
- [ ] AI-assisted parsing for messy and unstructured data
- [ ] Building a search crawler (e.g., using searxng for discovering new content)

## Contributing

Pull requests and suggestions are welcome! Feel free to open issues for bug reports or feature requests.

## License

MIT License

## Ready to Start Scraping?

👉 [Try Housefly Now](https://housefly.cc)


## Disclaimer

This is for educational purposes and web scraping on websites that don't want you to can violate ToSes and potentially get you in trouble if done at an industrial scale
