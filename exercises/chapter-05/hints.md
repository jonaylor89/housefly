# Chapter 5: Infinite Scroll with Playwright

## Hint 1
This page uses infinite scroll — content loads as you scroll down. You need to programmatically scroll the page to trigger loading of all photos before extracting data.

## Hint 2
Implement a scroll loop: get the current `document.body.scrollHeight`, scroll to the bottom with `window.scrollTo(0, document.body.scrollHeight)`, wait for new content to load, then check if the height changed. Stop when it doesn't.

## Hint 3
Use `page.waitForTimeout(1500)` between scrolls to give the page time to load new content. The loading delay is intentional — too fast and you'll miss items.

## Hint 4
Photo cards have class `.photo-card`. Extract the title from `h2`, photographer from `p` (remove "By " prefix), likes count from `.flex span` (remove "❤️ " prefix), and the image URL from the `img` `src` attribute.

## Hint 5
The image URLs may be encoded/proxied. Look for a `url=` parameter in the src and decode it with `decodeURIComponent()` to get the original picsum URL.
