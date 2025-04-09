import { chromium, type Page } from "playwright";

// Configuration
const TARGET_URL = "https://chapter8.housefly.cc";
const CREDENTIALS = {
  email: "demo@example.com",
  password: "password123",
};

// Main function to run the scraper
async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
  });

  // Store the session state for reuse if needed
  context.on("page", async (page) => {
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        console.error(`Browser console ${msg.type()}: ${msg.text()}`);
      }
    });
  });

  try {
    const page = await context.newPage();

    // Step 1: Navigate to the home page
    await page.goto(TARGET_URL);

    // Step 2: Log in to access premium features
    await login(page);

    // Step 3: Navigate to the search page
    await page.click('a[href="/search"]');

    // Step 4: Complete the multi-step search form and extract results
    const searchResults = await completeSearchProcess(page);

    // Step 5: Extract premium listings (only visible when logged in)
    const premiumListings = searchResults.filter(
      (listing) => listing.isPremium,
    );

    // Step 6: Save the search to user profile
    await saveSearch(page);

    // Step 7: Verify saved search appears in dashboard
    await verifySearchSaved(page);

    // Create the output object
    const output = {
      searchResults,
      premiumListings,
      savedSearch: {
        destination:
          searchResults.length > 0 ? searchResults[0].destination : "",
      },
    };

    // Print results as JSON to console
    console.log(JSON.stringify(output, null, 2));

    return output;
  } finally {
    await context.close();
    await browser.close();
  }
}

// Login function - handles authentication
async function login(page: Page): Promise<void> {
  // Navigate to login page
  await page.click('a[href="/login"]');

  // Wait for login form to be visible
  await page.waitForSelector("form");

  // Fill in login credentials
  await page.fill('input[name="email"]', CREDENTIALS.email);
  await page.fill('input[name="password"]', CREDENTIALS.password);

  // Submit the form
  await Promise.all([
    page.waitForNavigation(), // Wait for navigation to complete
    page.click('button[type="submit"]'),
  ]);

  // Verify login was successful by checking for dashboard link
  await page.waitForSelector('a[href="/dashboard"]', { timeout: 5000 });
}

// Complete the multi-step search process
async function completeSearchProcess(page: Page): Promise<any[]> {
  try {
    // Step 1: Destination selection
    await page.waitForSelector("input#destination", { timeout: 10000 });
    await page.fill("input#destination", "Paris, France");
    await page.waitForTimeout(1000); // Give more time for autocomplete

    // Select from autocomplete if available
    const autocompleteVisible = await page.isVisible(".absolute.z-10 div");
    if (autocompleteVisible) {
      await page.click(".absolute.z-10 div:first-child");
    }

    // Click Next button to move to date selection
    await page.waitForSelector('button:has-text("Next")', { timeout: 5000 });
    await page.click('button:has-text("Next: Select Dates")');

    // Step 2: Date selection
    await page.waitForSelector('div[class*="react-datepicker"]', {
      timeout: 10000,
    });

    // Get today's date and calculate next week's date
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Find available date cells and click two dates
    // First wait for the date cells to be properly loaded
    await page.waitForSelector('div[class*="react-datepicker__day"]', {
      timeout: 5000,
    });
    const dateCells = await page.$$(
      'div[class*="react-datepicker__day"]:not([class*="outside-month"])',
    );

    // Make sure we have enough date cells
    if (dateCells.length > 7) {
      // Click on today's date
      await dateCells[0].click();
      await page.waitForTimeout(500); // Wait a bit between clicks
      // Click on a date 7 days later
      await dateCells[7].click();
    } else {
      // Fallback: click the first and last available date if we don't have enough dates
      await dateCells[0].click();
      await page.waitForTimeout(500);
      await dateCells[dateCells.length - 1].click();
    }

    // Move to next step - wait for the button to be clickable
    await page.waitForSelector('button:has-text("Next: Refine Search")', {
      timeout: 5000,
    });
    await page.click('button:has-text("Next: Refine Search")');

    // Step 3: Refine search (filters)
    await page.waitForSelector('input[type="number"]', { timeout: 10000 });

    // Clear existing values then set price range
    await page.evaluate(() => {
      const minPriceInput = document.querySelector(
        'input[type="number"]:nth-of-type(1)',
      ) as HTMLInputElement;
      const maxPriceInput = document.querySelector(
        'input[type="number"]:nth-of-type(2)',
      ) as HTMLInputElement;
      if (minPriceInput) minPriceInput.value = "";
      if (maxPriceInput) maxPriceInput.value = "";
    });

    await page.fill('input[type="number"]:nth-of-type(1)', "100");
    await page.fill('input[type="number"]:nth-of-type(2)', "400");

    // Select amenities
    await page.waitForSelector("#amenity-Wi-Fi", { timeout: 5000 });
    await page.check("#amenity-Wi-Fi");

    // Submit search
    await page.waitForSelector('button:has-text("Search")', { timeout: 5000 });
    await page.click('button:has-text("Search")');

    // Wait for results to load
    await page.waitForSelector('h2:has-text("Search Results")', {
      timeout: 15000,
    });

    // Wait for loading spinner to disappear if present
    const spinnerSelector = ".animate-spin";
    const hasSpinner = await page.isVisible(spinnerSelector);
    if (hasSpinner) {
      await page.waitForSelector(spinnerSelector, {
        state: "hidden",
        timeout: 10000,
      });
    }

    // Additional wait to ensure results are fully loaded
    await page.waitForTimeout(2000);

    // Extract search results
    return await extractSearchResults(page);
  } catch (error) {
    console.error("Error during search process:", error);
    // Take a screenshot for debugging
    await page.screenshot({ path: "search-error.png" });
    // Return empty array instead of failing completely
    return [];
  }
}

// Extract search results from the page
async function extractSearchResults(page: Page): Promise<any[]> {
  // Wait for results to be visible
  await page.waitForSelector(".bg-white.rounded-lg.shadow-md.overflow-hidden");

  // Extract listing information
  const listings = await page.$$eval(
    ".bg-white.rounded-lg.shadow-md.overflow-hidden",
    (elements) => {
      return elements.map((el) => {
        // Determine if this is a premium listing
        const isPremium = !!el.querySelector(".bg-yellow-500");

        // Get the title
        const titleElement = el.querySelector("h3");
        const title = titleElement
          ? (titleElement.textContent?.trim() ?? "")
          : "";

        // Get destination from title (assuming format "[Location] [Type]")
        const destination = title.split(" ")[0];

        // Get the price
        const priceElement = el.querySelector(".text-blue-600");
        const priceText = priceElement ? priceElement.textContent?.trim() : "";
        const price = priceText
          ? parseInt(priceText.replace(/[^0-9]/g, ""))
          : 0;

        // Get the description
        const descriptionElement = el.querySelector(".text-gray-600");
        const description = descriptionElement
          ? descriptionElement.textContent?.trim()
          : "";

        // Get amenities
        const amenityElements = el.querySelectorAll(
          ".bg-blue-50.text-blue-700",
        );
        const amenities = Array.from(amenityElements).map((amenity) =>
          amenity.textContent?.trim(),
        );

        return {
          title,
          destination,
          price,
          description,
          amenities,
          isPremium,
        };
      });
    },
  );

  return listings;
}

// Save the current search to user profile
async function saveSearch(page: Page): Promise<void> {
  // Look for the 'Save this Search' button and click it
  const saveButtonSelector = 'button:has-text("Save this Search")';

  // Check if the button exists (it should only be visible when logged in)
  const saveButtonExists = await page.isVisible(saveButtonSelector);

  if (saveButtonExists) {
    await page.click(saveButtonSelector);

    // Wait for success confirmation
    await page.waitForSelector(".bg-green-50", { timeout: 5000 });
  } else {
    console.error(
      "Save button not found - search may already be saved or user not logged in",
    );
  }
}

// Verify the search was saved by checking dashboard
async function verifySearchSaved(page: Page): Promise<void> {
  // Navigate to dashboard
  await page.click('a[href="/dashboard"]');

  // Wait for dashboard to load
  await page.waitForSelector('h2:has-text("Your Saved Searches")');

  // Check if there are saved searches
  const hasSavedSearches = await page.isVisible(".border.rounded-md");

  if (!hasSavedSearches) {
    throw new Error("No saved searches found in dashboard");
  }
}

main().catch(console.error);
