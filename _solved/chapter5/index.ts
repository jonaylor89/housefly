import { chromium } from "playwright";

const URI = "https://chapter5.housefly.cc";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the page
    await page.goto(URI);

    // Wait for all photos to load (wait for the last page)
    // Since there are 10 pages with 10 photos each
    await page.waitForSelector(".photo-card");

    // Scroll to bottom until we load all photos
    let previousHeight;
    while (true) {
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForTimeout(1500); // Wait for the loading delay

      const newHeight = await page.evaluate("document.body.scrollHeight");
      if (newHeight === previousHeight) {
        break;
      }
    }

    // Extract all photo items
    const photos = await page.$$eval(".photo-card", (items) => {
      function extractPicsumUrl(encodedUrl: string): string {
        const match = encodedUrl.match(/url=(.*?)&/);
        if (!match) return "";
        return decodeURIComponent(decodeURIComponent(match[1]));
      }

      return items.map((item) => {
        const title = item.querySelector("h2")?.textContent || "";
        const photographer =
          item.querySelector("p")?.textContent?.replace("By ", "") || "";
        const likes = parseInt(
          item.querySelector(".flex span")?.textContent?.replace("❤️ ", "") ||
            "0",
        );
        const encodedUrl = item.querySelector("img")?.getAttribute("src") || "";
        const url = extractPicsumUrl(encodedUrl);

        return {
          title,
          url,
          photographer,
          likes,
        };
      });
    });

    // Print CSV header
    console.log("title,url,photographer,likes");

    // Print each item as CSV row, sorted by ID
    photos.forEach((photo) => {
      console.log(
        `${photo.title},${photo.url},${photo.photographer},${photo.likes}`,
      );
    });

    return photos;
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the scraper
main().catch(console.error);
