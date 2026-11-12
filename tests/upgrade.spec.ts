import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test.beforeAll(async () => { await mkdir('artifacts', { recursive: true }); });

test('preloader gate appears once per session and hands off to the hero', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('/');
  const gate = page.locator('[data-preloader]');
  await expect(gate).toBeVisible();
  await expect(page.locator('[data-preloader-count]')).toHaveText('100', { timeout: 15000 });
  await expect(page.getByRole('button', { name: 'Enter quietly' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/preloader.png' });
  await page.getByRole('button', { name: 'Enter quietly' }).click();
  await expect(gate).toHaveCount(0, { timeout: 5000 });
  await expect(page.locator('html')).toHaveClass(/entered/);
  await expect(page.locator('.sound-button')).toHaveAttribute('aria-pressed', 'false');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: 'artifacts/hero-after-entrance.png' });
  await page.reload();
  await expect(page.locator('[data-preloader]')).toBeHidden();
  expect(errors).toEqual([]);
});

test.describe('after entry', () => {
  test.beforeEach(async ({ page }) => { await page.addInitScript(() => sessionStorage.setItem('kannan:entered', '1')); });

  test('credentials list every certificate with verification links', async ({ page }) => {
    await page.goto('/#credentials');
    const section = page.locator('#credentials');
    await expect(section.getByRole('heading', { name: /Claude Certified Developer/ })).toBeVisible();
    await expect(section).toContainText('Azure AI Fundamentals');
    await expect(section.locator('.credential-index li')).toHaveCount(6);
    await expect(section.getByRole('link', { name: 'Verify credential' })).toHaveAttribute('href', 'https://www.credly.com/badges/4454d4ef-855a-4596-be5d-5e60fdfaed18');
    for (const title of ['PowerShell for Active Directory', 'ITIL 4', 'Cloud Computing Fundamentals', 'Cyber Security Awareness', 'Machine Learning for Data Science', 'AI Literacy Basics'])
      await expect(section).toContainText(title);
    await page.waitForTimeout(1500);
    await section.screenshot({ path: 'artifacts/credentials.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });

  test('the public site does not link to the private garage', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('a[href*="/alias"]')).toHaveCount(0);
  });

  test('garage preview: bays, inspect, zebra and exit', async ({ page, request }) => {
    test.skip((await request.get('/alias/')).status() !== 200, 'Garage is not built (production without PUBLIC_ALIAS_GARAGE)');
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/alias/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('.garage-canvas canvas')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('.garage')).toHaveClass(/is-open/, { timeout: 8000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: 'artifacts/garage-bay-01.png' });
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-g-name]')).toHaveText(/Study 02/);
    await page.waitForTimeout(1900);
    await page.screenshot({ path: 'artifacts/garage-bay-02.png' });
    await page.getByRole('button', { name: /Enter/ }).click();
    await expect(page.locator('.garage')).toHaveClass(/is-inspecting/);
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'artifacts/garage-inspect.png' });
    await page.getByRole('radio', { name: /Zebra/ }).click();
    await expect(page.getByRole('radio', { name: /Zebra/ })).toHaveAttribute('aria-checked', 'true');
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'artifacts/garage-zebra.png' });
    await page.keyboard.press('3');
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'artifacts/garage-wire.png' });
    await page.keyboard.press('Escape');
    await expect(page.locator('.garage')).not.toHaveClass(/is-inspecting/);
    await page.waitForTimeout(1700);
    await page.getByRole('link', { name: 'Kannan — home' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).not.toHaveClass(/garage-mode/);
    expect(errors).toEqual([]);
  });
});
