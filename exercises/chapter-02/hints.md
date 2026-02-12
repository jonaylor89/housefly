# Chapter 2: Lists and Selectors

## Hint 1
The page contains product cards with class `.product`. Each product has an `id` attribute on its container element. Use `$(".product").each(...)` to iterate over them.

## Hint 2
Inside each product, look for specific selectors: `h2` for the name, `.price` for the price, `.sku` for the SKU code. Use `$el.find("selector").text()` to extract text.

## Hint 3
Product specifications (Size, Color, Material, Stock) are inside a `.specs` list. Each `<li>` contains text like `"Size: 10"`. Split on `": "` and take the second part to get the value.

## Hint 4
Build the CSV output by starting with the header row `"ID,Name,Price,SKU,Size,Color,Material,Stock"`, then appending each product as a comma-separated row.

## Hint 5
Use `.map()` and `.get()` on cheerio collections to convert them to arrays. The `.get()` method is needed to unwrap cheerio's wrapper and get a plain JavaScript array.
