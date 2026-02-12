# Chapter 8: Login & Multi-Step Forms

## Hint 1
Start by implementing a login function. Navigate to the login page via `page.click('a[href="/login"]')`, fill in the email and password fields, then submit the form. Verify login succeeded by checking for a dashboard link.

## Hint 2
The search is a multi-step form. Step 1: Fill in a destination (e.g., "Paris, France") in the `input#destination` field. Watch for autocomplete suggestions and select one if they appear.

## Hint 3
Step 2 is date selection using a date picker. Wait for the date picker to appear, then click on available date cells. Select two dates (check-in and check-out). Use `page.waitForTimeout()` between clicks.

## Hint 4
Step 3 involves filters: set price range in number inputs, check amenity checkboxes (like `#amenity-Wi-Fi`), then click the Search button. Wait for results to load.

## Hint 5
After extracting results, look for a "Save this Search" button (only visible when logged in). Click it, wait for confirmation, then verify it saved by navigating to the dashboard.
