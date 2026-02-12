# Chapter 4: Dynamic Content with Playwright

## Hint 1
This page renders its content with JavaScript, so `fetch()` + cheerio won't work — the HTML returned by fetch won't have the dynamic content. You need a real browser via Playwright.

## Hint 2
After navigating to the page with `page.goto(URI)`, you need to wait for the dynamic content to load. Use `page.waitForSelector(".news-item")` to wait until news items appear in the DOM.

## Hint 3
Use `page.$$eval(".news-item", items => ...)` to extract data from all matching elements at once. Inside the callback, you can use standard DOM APIs like `querySelector`, `textContent`, and `getAttribute`.

## Hint 4
For each news item, extract: the title from `h2`, the content from `p`, the author from `.meta span` (removing the "By " prefix), and the timestamp from the `datetime` attribute on `<time>`.

## Hint 5
Format the output as CSV with the header `title,content,author,timestamp`. Wrap each value in double quotes to handle commas or special characters in the text.
