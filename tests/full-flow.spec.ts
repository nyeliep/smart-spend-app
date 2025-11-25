import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
  const userEmail = 'john@example.com';
  const userPassword = 'password123'; 

  test.beforeEach(async ({ page }) => {
    
    await page.goto('http://localhost:5173/login');

    
    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.click('button[type="submit"]');

    
    await page.waitForSelector('text=Balance');
  });

  test('should display balance, totals, and expense list', async ({ page }) => {
    
    await expect(page.locator('text=Balance')).toBeVisible();
    await expect(page.locator('text=Total Income')).toBeVisible();
    await expect(page.locator('text=Total Expenses')).toBeVisible();

    
    await expect(page.locator('text=Food')).toBeVisible();

    
    await expect(page.locator('text=+ksh 500')).toBeVisible();
  });

  test('should log out successfully', async ({ page }) => {
    await page.click('text=Logout');

  
    await expect(page).toHaveURL(/\/login/);
  });

  test('should add income and reflect in dashboard', async ({ page }) => {
    await page.click('text=Add Income');
    await page.fill('input[name="source"]', 'Freelance');
    await page.fill('input[name="amount"]', '1000');
    await page.click('button[type="submit"]');

    
    await expect(page.locator('text=+ksh 1000')).toBeVisible();
  });

  test('should add expense and reflect in dashboard', async ({ page }) => {
    await page.click('text=Add Expense');
    await page.fill('input[name="category"]', 'Transport');
    await page.fill('input[name="amount"]', '200');
    await page.click('button[type="submit"]');

    
    await expect(page.locator('text=Transport')).toBeVisible();
  });
});
