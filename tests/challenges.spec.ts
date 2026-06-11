import { test, expect } from '@playwright/test';

// ---------------------------------------------------------
// Challenge 1 — Locked user
// ---------------------------------------------------------
test('locked user cannot login and sees error', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  
  // Try to login with the locked out account
  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  // Assert the exact error message appears
  const errorMessage = page.locator('[data-test="error"]');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText('Sorry, this user has been locked out');
});

// ---------------------------------------------------------
// Challenge 2 — Sorting products
// ---------------------------------------------------------
test('sort products by price (Low to High)', async ({ page }) => {
  // 1. Login first
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  // 2. Interact with the dropdown menu
  // The <select> element has the class 'product_sort_container'
  // The value for low-to-high is 'lohi'
  await page.locator('.product_sort_container').selectOption('lohi');

  // 3. Assert the first item is the cheapest ($7.99)
  const firstItemPrice = page.locator('.inventory_item_price').first();
  await expect(firstItemPrice).toHaveText('$7.99');
});

// ---------------------------------------------------------
// Challenge 3 — Logout
// ---------------------------------------------------------
test('user can successfully logout', async ({ page }) => {
  // 1. Login first
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  // 2. Open the side menu (burger menu)
  await page.getByRole('button', { name: /open menu/i }).click();
  
  // 3. Click logout
  // Note: Playwright sometimes moves faster than the menu animation.
  // The locator will automatically wait for the button to be clickable.
  await page.locator('#logout_sidebar_link').click();

  // 4. Assert we are back on the login page by checking if the login button is visible
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});