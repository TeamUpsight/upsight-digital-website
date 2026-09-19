import { test, expect, type Page } from '@playwright/test';

test.setTimeout(180_000);

// Intentional, human-reviewed visual record. This is kept separate from
// functional regression coverage and writes a compact representative baseline.
const pages = [
  '/', '/services', '/services/cookie-consent', '/who-its-for', '/process',
  '/about', '/case-studies', '/case-studies/slice', '/case-studies/roadsurfer',
  '/contact', '/health-check',
];
const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'wide', width: 1920, height: 1080 },
] as const;
const label = process.env.UX_AUDIT_LABEL ?? 'before';

async function settle(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => document.fonts.status === 'loaded');
}

test('capture representative UX baseline', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.route('**/www.googletagmanager.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const path of pages) {
      await page.goto(path);
      await settle(page);
      await expect(page.locator('main')).toBeVisible();
      await page.screenshot({ path: `test-results/ux-audit/${label}-${viewport.name}-${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}-initial.png`, fullPage: false });
    }
  }

  // Major pages get scroll and interaction states; the remaining routes are
  // represented by their initial state above.
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const path of ['/', '/services', '/contact', '/health-check']) {
      await page.goto(path); await settle(page);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5));
      await page.waitForTimeout(250);
      await page.screenshot({ path: `test-results/ux-audit/${label}-${viewport.name}-${path === '/' ? 'home' : path.slice(1)}-mid.png` });
      await page.locator('footer').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `test-results/ux-audit/${label}-${viewport.name}-${path === '/' ? 'home' : path.slice(1)}-footer.png` });
    }
  }
  await context.close();
});

test('capture representative interaction states', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await page.route('**/www.googletagmanager.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.route('**/challenges.cloudflare.com/turnstile/**', route => route.fulfill({ contentType: 'application/javascript', body: `window.turnstile={render(el,o){el.textContent='Verification complete';queueMicrotask(()=>o.callback('audit-token'));return 'audit'},remove(){}}` }));

  await page.goto('/'); await settle(page);
  await page.locator('#resources-menu').hover();
  await page.screenshot({ path: `test-results/ux-audit/${label}-resources-open.png` });
  const card = page.locator('main a[href^="/services/"]').first();
  await card.hover(); await page.screenshot({ path: `test-results/ux-audit/${label}-service-card-hover.png` });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Toggle menu' }).click();
  await page.screenshot({ path: `test-results/ux-audit/${label}-mobile-menu-open.png` });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/contact'); await settle(page);
  await page.locator('#contact-form summary').click();
  await page.screenshot({ path: `test-results/ux-audit/${label}-contact-expanded.png` });

  await page.goto('/health-check'); await settle(page);
  await page.getByRole('button', { name: 'Start Health Check' }).click();
  await page.screenshot({ path: `test-results/ux-audit/${label}-health-question.png` });
  await context.close();
});
