# Chapter 1: Basic HTML Scraping

## Hint 1
Start by fetching the page content using `fetch()`. Remember that `fetch()` returns a Response object — you'll need to call `.text()` on it to get the HTML string.

## Hint 2
Once you have the HTML string, load it into cheerio using `cheerio.load(body)`. This gives you a jQuery-like `$` function you can use to query the DOM.

## Hint 3
Look at the page structure — the text you need to extract is inside `<p>` tags. Use `$("p").text()` to get the text content of all paragraph elements.

## Hint 4
Don't forget to `console.log()` the extracted text so it appears in stdout. The checker compares your stdout output against the expected file.
