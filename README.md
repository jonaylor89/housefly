
![Housefly Logo](/apps/tutorial/public/housefly-logo.png)

# Housefly: A Hands-On Web Scraping Playground

Housefly is an interactive learning project designed to teach web scraping through structured challenges. Each chapter includes a companion website built specifically to be scraped, allowing you to practice in a controlled environment.

🌐 **Translations:** [العربية](docs/README.ar.md) · [Español](docs/README.es.md) · [فارسی](docs/README.fa.md) · [ગુજરાતી](docs/README.gu.md) · [हिन्दी](docs/README.hi.md) · [日本語](docs/README.ja.md) · [Русский](docs/README.ru.md) · [தமிழ்](docs/README.ta.md) · [Türkçe](docs/README.tr.md) · [اردو](docs/README.ur.md) · [中文](docs/README.zh.md)

## Features

* Realistic Web Scraping Challenges – Work with purpose-built websites.
* Structured Learning – Progress through 11 guided exercises.
* Automated Solution Checking – Verify your scrapers against expected outputs.
* Progressive Hints – Get help when you're stuck without seeing the full solution.
* Watch Mode – Auto-validate as you code.

## Getting Started

1. Clone the Repository

```sh
git clone https://github.com/jonaylor89/housefly.git
cd housefly
```

2. Install Dependencies

```sh
npm install
```

3. Start the Chapter Servers

```sh
turbo dev
```

This starts all chapter target websites on fixed local ports (3001–3011).

4. Navigate to a Chapter

Each chapter is in `exercises/chapter-NN/` with a starter workspace, expected output, hints, and a reference solution.

5. Write Your Scraper

Edit the starter code in `exercises/chapter-NN/starter/src/index.ts`.

6. Validate Your Answer

```sh
# Using npm scripts
npm run validate -- <chapter>

# Or directly with npx
npx tsx packages/cli/src/main.ts validate <chapter>

# Short alias
npm run ca <chapter>
```

7. Get Hints

```sh
npm run hint -- <chapter>
```

8. Watch Mode (auto-revalidate on save)

```sh
npm run watch -- <chapter>
```

## Project Structure

```
housefly/
├── apps/
│   ├── tutorial/               # Next.js tutorial site
│   ├── chapter1/               # Target website for Chapter 1 (port 3001)
│   ├── chapter2/               # Target website for Chapter 2 (port 3002)
│   └── ...                     # Chapters 3–11
├── exercises/
│   ├── chapter-01/
│   │   ├── starter/src/        # Student workspace (edit this!)
│   │   ├── solution/src/       # Reference solution
│   │   ├── expected/           # Expected output
│   │   ├── chapter.config.ts   # Chapter metadata & hints
│   │   └── hints.md            # Progressive hints
│   └── ...                     # Chapters 02–11
├── packages/
│   ├── scraper-kit/            # Shared scraping utilities
│   ├── test-harness/           # Validation engine (Node/tsx)
│   └── cli/                    # housefly CLI tool
├── scripts/
│   └── verify_rearchitecture.sh  # Smoke-test script
└── turbo.json                  # Turborepo configuration
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `housefly run <chapter>` | Execute a chapter's starter code |
| `housefly validate <chapter>` | Run + compare against expected output |
| `housefly validate --all` | Validate all chapters (CI mode) |
| `housefly watch <chapter>` | Re-validate on file changes |
| `housefly hint <chapter>` | Show next progressive hint |
| `housefly reset <chapter>` | Restore starter files to original |
| `housefly open <chapter>` | Open exercise folder |

## Chapters

| # | Topic | Techniques |
|---|-------|-----------|
| 1 | Hello World Scraping | HTTP fetch, Cheerio basics |
| 2 | Lists and Selectors | CSS selectors, data extraction |
| 3 | AI-Assisted Scraping | OpenAI API, LLM parsing |
| 4 | Dynamic Content | Playwright, JS-rendered pages |
| 5 | Infinite Scroll | Scroll detection, lazy loading |
| 6 | Multi-Page Crawling | Crawlee, link following |
| 7 | API Pagination | REST APIs, pagination |
| 8 | Authentication & Forms | Login flows, multi-step forms |
| 9 | GraphQL Scraping | GraphQL queries, mutations |
| 10 | Media Extraction | PDFs, images, videos |
| 11 | Polite Scraping | robots.txt, rate limiting, CAPTCHAs |

## Add Env Vars (Optional)

Some challenges require 3rd party APIs (e.g., OpenAI). Copy the template and fill in your keys:

```sh
cp .env.template .env
```

## Contributing

Pull requests and suggestions are welcome! Feel free to open issues for bug reports or feature requests.

## License

MIT License

## Ready to Start Scraping?

👉 [Try Housefly Now](https://housefly.cc)

## Disclaimer

This is for educational purposes. Web scraping on websites that don't want you to can violate ToS and potentially get you in trouble if done at an industrial scale.
