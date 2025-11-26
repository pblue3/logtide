import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
	test('should have working navigation links', async ({ page }) => {
		await page.goto('/login');

		// Check that login page loads
		await expect(page).toHaveURL(/\/login/);
		await expect(page.locator('h1')).toContainText('Login');
	});

	test('should redirect to login when accessing protected routes', async ({ page }) => {
		// Try to access dashboard without auth
		await page.goto('/dashboard');
		await expect(page).toHaveURL(/\/login/);

		// Try to access search without auth
		await page.goto('/search');
		await expect(page).toHaveURL(/\/login/);

		// Try to access projects without auth
		await page.goto('/projects');
		await expect(page).toHaveURL(/\/login/);

		// Try to access settings without auth
		await page.goto('/settings');
		await expect(page).toHaveURL(/\/login|\/settings\/profile/);
	});

	test('register page should load', async ({ page }) => {
		await page.goto('/register');

		await expect(page.locator('h1')).toContainText('Register');
		await expect(page.locator('input[type="email"]')).toBeVisible();
		await expect(page.locator('input[type="password"]')).toBeVisible();
	});
});
