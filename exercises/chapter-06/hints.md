# Chapter 6: Multi-Page Crawling with Crawlee

## Hint 1
The site has a navigation structure with categories (electronics, clothing) and subcategories. Start by enqueuing links from the homepage's `nav a` elements to discover all category pages.

## Hint 2
In the `requestHandler`, check `request.url` to determine which page you're on. Use `request.url.includes("/products/electronics/phones.html")` etc. to handle each page type differently.

## Hint 3
For product pages, use cheerio selectors like `$(".product-card")` to find products. Extract name from `.product-name`, price from `.product-price`, rating from `.product-rating`, features from `.product-specs li`, and stock from `.stock-status`.

## Hint 4
Use `pushData()` to store extracted data with a `type` field (e.g., `"phones"`, `"laptops"`) so you can organize results later. The main function processes these into the final nested JSON structure.

## Hint 5
For the clothing pages, products are organized under section IDs like `#shirts`, `#pants`, `#dresses`, `#tops`. Use these to scope your selectors: `$("#shirts .product-card")`.
