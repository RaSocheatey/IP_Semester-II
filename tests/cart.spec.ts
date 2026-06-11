import { test, expect } from '@playwright/test';

test('add product to cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  // .first() is used because there are multiple "Add to cart" buttons
  await page.getByRole('button', { name: /add to cart/i }).first().click();

  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');
});

test('view cart page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await page.getByRole('button', { name: /add to cart/i }).first().click();
  await page.locator('.shopping_cart_link').click();

  await expect(page).toHaveURL(/cart.html/);
  await expect(page.getByText('Your Cart')).toBeVisible();
});

test('remove item from cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: /login/i }).click();

  await page.getByRole('button', { name: /add to cart/i }).first().click();
  await page.locator('.shopping_cart_link').click();

  await page.getByRole('button', { name: /remove/i }).click();
  // We expect the badge to disappear entirely, so count should be 0
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});