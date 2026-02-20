import { chromium } from "playwright";

const URI = "http://localhost:3005";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  try {
    // Navigate to the page
    await page.goto(URI);

    // Wait for initial photos to load
    await page.waitForSelector(".photo-card");

    // Scroll to bottom until all 100 photos are loaded (10 pages × 10 photos)
    const TOTAL_PHOTOS = 100;
    let lastCount = 0;
    let staleRounds = 0;
    while (true) {
      const count = await page.$$eval(".photo-card", (els) => els.length);
      if (count >= TOTAL_PHOTOS) break;

      if (count === lastCount) {
        staleRounds++;
        if (staleRounds > 15) break; // safety exit
      } else {
        staleRounds = 0;
        lastCount = count;
      }

      // Scroll to the very bottom to trigger the IntersectionObserver on the loader div
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await page.waitForTimeout(500);
    }

    // Extract all photo items
    const photos = await page.$$eval(".photo-card", (items) => {
      return items.map((item) => {
        const title = item.querySelector("h2")?.textContent || "";
        const photographer =
          item.querySelector("p")?.textContent?.replace("By ", "") || "";
        const likes = parseInt(
          item.querySelector(".flex span")?.textContent?.replace("❤️ ", "") ||
            "0",
        );
        const url = item.querySelector("img")?.getAttribute("src") || "";

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
