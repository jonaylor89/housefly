import { chromium } from "playwright";

const URI = "http://localhost:3005";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to the page
    await page.goto(URI);

    // TODO: Implement the scraper logic here
  } catch (error) {
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the scraper
main().catch(console.error);
