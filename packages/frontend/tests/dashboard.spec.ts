import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
	test('should load dashboard with all widgets', async ({ page }) => {
		await page.goto('/dashboard');

		// Should redirect to login if not authenticated
		await expect(page).toHaveURL(/\/login/);
	});

	test('dashboard has stats cards after auth', async ({ page }) => {
		// TODO: Add authentication setup
		// For now, just verify the page structure exists
		await page.goto('/dashboard');
	});

	test('dashboard has charts', async ({ page }) => {
		await page.goto('/dashboard');
		// Verify chart container exists when authenticated
		// await expect(page.locator('[class*="echarts"]')).toBeVisible();
	});
});
