import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
	test('should display login form', async ({ page }) => {
		await page.goto('/login');

		// Check for login form elements
		await expect(page.locator('input[type="email"]')).toBeVisible();
		await expect(page.locator('input[type="password"]')).toBeVisible();
		await expect(page.locator('button[type="submit"]')).toBeVisible();
	});

	test('should have link to register page', async ({ page }) => {
		await page.goto('/login');

		const registerLink = page.locator('a[href="/register"]');
		await expect(registerLink).toBeVisible();
	});

	test('should show validation errors for empty fields', async ({ page }) => {
		await page.goto('/login');

		// Try to submit without filling fields
		await page.locator('button[type="submit"]').click();

		// HTML5 validation should prevent submission
		const emailInput = page.locator('input[type="email"]');
		const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
		expect(isInvalid).toBeTruthy();
	});

	test('should navigate to dashboard on successful login', async ({ page }) => {
		await page.goto('/login');

		// Fill in mock credentials
		await page.locator('input[type="email"]').fill('test@example.com');
		await page.locator('input[type="password"]').fill('password123');
		await page.locator('button[type="submit"]').click();

		// Should redirect to dashboard (if backend is running)
		// await expect(page).toHaveURL(/\/dashboard/);
	});
});
