
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
git clone https://github.com/jonaylor89/housefly.git
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

## Contributing

Pull requests and suggestions are welcome! Feel free to open issues for bug reports or feature requests.

## License

MIT License

## Ready to Start Scraping?

👉 [Try Housefly Now](https://housefly.cc)


## Disclaimer

This is for educational purposes and web scraping on websites that don't want you to can violate ToSes and potentially get you in trouble if done at an industrial scale
