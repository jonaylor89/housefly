import { chromium } from "playwright";

const URI = "http://localhost:3004";

async function main() {
  // Launch the browser
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the page
    await page.goto(URI);

    // TODO: Implement the solution
  } catch (error) {
    throw error;
  } finally {
    // Clean up
    await browser.close();
  }
}

// Run the scraper
main().catch((error) => console.error("Scraping failed:", error));
