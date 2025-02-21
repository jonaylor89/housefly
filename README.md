

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

Each chapter contains a simple website to scrape, along with an expected.txt file defining the correct output.

3. Write Your Scraper

Implement your solution inside the corresponding solution{number}/ directory.

4. Check Your Answer

Run the validation script to compare your scraper’s output against expected.txt:

```sh
npm run ca 1
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
│   │   ├── expected.txt
│   │   ├── index.ts
│   │   ├── package.json
├── scripts/
│   ├── check_answers.sh  # Script to validate solutions
```

## Roadmap

- [x] basic single html file
- [ ] basic single html with structured text
- [ ] basic single html but with dynamic javascript content
    - [ ] pupeteer or playwright
- [ ] basic single html file with unstructured text needing structure (AI)
    - [ ] storing data and duplicates (index of URL -> data)
- [ ] multiple pages all within the same subdomain and path prefix (/content/*)
    - [ ] sitemap + link crawling
- [ ] random websites with different path structure and unstructured data needing structure
- [ ] random topic with unknown websites (perplexity style) crawl of unstructured data needing structure
    - [ ] searxng
- [ ] captchas and web crawling defense mechanisms



## Contributing

Pull requests and suggestions are welcome! Feel free to open issues for bug reports or feature requests.

## License

MIT License

## Ready to Start Scraping?

👉 Try Housefly Now


## Disclaimer

This is for educational purposes and web scraping on websites that don't want you to can violate ToSes and potentially get you in trouble if done at an industrial scale
