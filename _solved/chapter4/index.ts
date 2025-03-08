import { chromium } from "playwright";

const URI = "https://chapter4.housefly.cc";

async function main() {
  // Launch the browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the page
    await page.goto(URI);

    // Wait for news items to appear
    await page.waitForSelector(".news-item");

    // Extract all news items
    const newsItems = await page.$$eval(".news-item", (items) => {
      return items.map((item) => {
        const title = item.querySelector("h2")?.textContent || "";
        const content = item.querySelector("p")?.textContent || "";
        const author =
          item.querySelector(".meta span")?.textContent?.replace("By ", "") ||
          "";
        const timestamp =
          item.querySelector("time")?.getAttribute("datetime") || "";

        return {
          title,
          content,
          author,
          timestamp,
        };
      });
    });

    // Print CSV header
    console.log("title,content,author,timestamp");

    // Print each item as CSV row
    newsItems.forEach((item) => {
      console.log(
        `"${item.title}","${item.content}","${item.author}","${item.timestamp}"`,
      );
    });

    return newsItems;
  } catch (error) {
    throw error;
  } finally {
    // Clean up
    await browser.close();
  }
}

// Run the scraper
main().catch((error) => console.error("Scraping failed:", error));
