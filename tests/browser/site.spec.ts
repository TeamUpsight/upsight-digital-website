import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { questions } from '../../src/lib/health-check/domain';

// Tests use a deterministic widget and intercept delivery, never live email.
async function mockVerification(page: Page) {
  await page.route('**/challenges.cloudflare.com/turnstile/**', route => route.fulfill({
    contentType: 'application/javascript',
    body: `window.turnstile = { render(el, options) { el.textContent = 'Verification complete'; queueMicrotask(() => options.callback('browser-test-token')); return 'widget'; }, remove() {} };`,
  }));
  await page.route('**/www.googletagmanager.com/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await page.route('**/r2.leadsy.ai/**', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
}

test.beforeEach(async ({page}) => { await mockVerification(page); });

const canonicalUrl = (path: string) => path === '/' ? 'https://upsight.digital/' : `https://upsight.digital${path.endsWith('/') ? path : `${path}/`}`;
const publicRoutes = ['/', '/services/', '/services/tracking-audit/', '/services/server-side-tracking/', '/services/ga4-gtm-setup/', '/services/meta-conversions-api/', '/services/mobile-analytics/', '/services/mobile-measurement/', '/services/measurement-planning/', '/services/analytics-dashboards/', '/services/cookie-consent/', '/who-its-for/', '/process/', '/about/', '/case-studies/', '/case-studies/slice/', '/case-studies/roadsurfer/', '/contact/', '/health-check/', '/404/'];

for (const path of publicRoutes) {
  test(`semantic HTML, assets and accessibility: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(path);
    await expect(page.locator('astro-island[client="load"][ssr]')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('a button, button a, a a, button button')).toHaveCount(0);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', canonicalUrl(path));
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', canonicalUrl(path));
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /hero_analytics_abstract\.webp$/);
    const leadsy = page.locator('head script#vtag-ai-js');
    await expect(leadsy).toHaveCount(1);
    await expect(leadsy).toHaveAttribute('src', 'https://r2.leadsy.ai/tag.js');
    await expect(leadsy).toHaveAttribute('data-pid', 'LnE2P4juFc7jvRJV');
    await expect(leadsy).toHaveAttribute('data-version', '062024');
    await expect(leadsy).toHaveAttribute('async', '');
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
    if (path === '/case-studies/roadsurfer/') await expect(page.locator('astro-island')).toHaveCount(0);
    if (path === '/case-studies/slice/') {
      await expect(page.locator('astro-island')).toHaveCount(1);
      await expect(page.locator('astro-island')).toHaveAttribute('component-url', /SliceVideo/);
    }
  });
}

test('keyboard navigation, dropdowns, skip link and mobile menu', async ({page}) => {
  const movePointerAwayFromNavigation = async () => {
    await page.mouse.move(10, 250);
  };
  await page.goto('/');
  await expect(page.getByText('Digital analytics, tracking & measurement implementation', {exact:true})).toHaveCount(0);
  const desktopNavigation = page.locator('#desktop-navigation-links');
  await expect(desktopNavigation.locator(':scope > a, :scope > details > summary')).toHaveText([
    'Home',
    'Services',
    'Case Studies',
    'Resources',
    'Free Health Check',
  ]);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name:'Skip to main content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  const servicesMenu = page.locator('#services-menu');
  const services = servicesMenu.locator('summary');
  const resourcesMenu = page.locator('#resources-menu');
  const resources = resourcesMenu.locator('summary');
  await movePointerAwayFromNavigation();
  await services.hover();
  await expect(servicesMenu).toHaveAttribute('open', '');
  await movePointerAwayFromNavigation();
  await expect(servicesMenu).not.toHaveAttribute('open');
  await services.click();
  await expect(servicesMenu).toHaveAttribute('open', '');
  for (const row of [
    ['/services/ga4-gtm-setup/', '/services/meta-conversions-api/', '/services/measurement-planning/'],
    ['/services/mobile-analytics/', '/services/mobile-measurement/', '/services/tracking-audit/'],
    ['/services/server-side-tracking/', '/services/cookie-consent/', '/services/analytics-dashboards/'],
  ]) {
    const topPositions = await Promise.all(row.map((href) => servicesMenu.locator(`a[href="${href}"]`).evaluate((link) => link.getBoundingClientRect().top)));
    expect(Math.max(...topPositions) - Math.min(...topPositions), JSON.stringify({row, topPositions})).toBeLessThanOrEqual(1);
  }
  await services.click();
  await expect(servicesMenu).not.toHaveAttribute('open');
  await services.click();
  await expect(servicesMenu).toHaveAttribute('open', '');
  await resources.click();
  await expect(resourcesMenu).toHaveAttribute('open', '');
  await expect(servicesMenu).not.toHaveAttribute('open');
  await services.click();
  await expect(servicesMenu).toHaveAttribute('open', '');
  await expect(resourcesMenu).not.toHaveAttribute('open');
  await services.click();
  await expect(servicesMenu).not.toHaveAttribute('open');
  await movePointerAwayFromNavigation();
  await services.focus(); await page.keyboard.press('Enter');
  await expect(servicesMenu).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(services).toBeFocused();
  await expect(servicesMenu).not.toHaveAttribute('open');
  await resources.focus(); await page.keyboard.press('Enter');
  await expect(resourcesMenu).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(resourcesMenu.locator('a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(resources).toBeFocused();
  await expect(resourcesMenu).not.toHaveAttribute('open');
  await page.setViewportSize({width:390,height:844});
  const mobileMenu = page.locator('#mobile-menu');
  const mobileServicesMenu = page.locator('#mobile-services-menu');
  const mobileServicesSummary = mobileServicesMenu.locator('summary');
  const mobileResourcesMenu = page.locator('#mobile-resources-menu');
  const mobileResourcesSummary = mobileResourcesMenu.locator('summary');
  const viewAllServices = mobileServicesMenu.getByRole('link', {name:'View all services'});
  await expect(mobileMenu).toHaveAttribute('inert','');
  await expect(mobileServicesSummary).toBeHidden();
  await page.getByRole('button',{name:'Toggle menu'}).focus();
  await page.keyboard.press('Tab');
  await expect(mobileMenu.locator(':focus')).toHaveCount(0);
  await page.getByRole('button',{name:'Toggle menu'}).click();
  await expect(page.locator('#mobile-menu-button')).toHaveAttribute('aria-expanded','true');
  await expect(mobileMenu).not.toHaveAttribute('inert');
  await expect(mobileServicesSummary).toBeVisible();
  await expect(viewAllServices).toBeHidden();
  await mobileServicesSummary.focus(); await page.keyboard.press('Enter');
  await expect(mobileServicesMenu).toHaveAttribute('open','');
  await expect(viewAllServices).toBeVisible();
  const mobileServiceHrefs = await mobileServicesMenu.locator('div a').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect(mobileServiceHrefs.slice(0, -1)).toEqual(['/services/ga4-gtm-setup/','/services/mobile-analytics/','/services/server-side-tracking/','/services/meta-conversions-api/','/services/mobile-measurement/','/services/cookie-consent/','/services/measurement-planning/','/services/tracking-audit/','/services/analytics-dashboards/']);
  await mobileResourcesSummary.click();
  await expect(mobileResourcesMenu).toHaveAttribute('open', '');
  await mobileServicesMenu.getByRole('link',{name:'Server-Side Tracking'}).focus();
  await expect(mobileServicesMenu.getByRole('link',{name:'Server-Side Tracking'})).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu-button')).toHaveAttribute('aria-expanded','false');
  await expect(mobileMenu).toHaveAttribute('inert','');
  await expect(mobileServicesMenu).not.toHaveAttribute('open');
  await expect(mobileResourcesMenu).not.toHaveAttribute('open');
  await expect(page.locator('#mobile-menu-button')).toBeFocused();
  await expect(mobileServicesSummary).toBeHidden();
  await page.getByRole('button',{name:'Toggle menu'}).click();
  await expect(mobileServicesSummary).toBeVisible();
  await expect(viewAllServices).toBeHidden();
  await mobileServicesSummary.click();
  await expect(mobileServicesMenu).toHaveAttribute('open','');
  await expect(viewAllServices).toBeVisible();
  await viewAllServices.click();
  await expect(page).toHaveURL(/\/services\/$/);
});

test('service cards use detailed pages and case-study back links use final URLs', async ({page}) => {
  await page.goto('/');
  const expectedServices = ['/services/server-side-tracking/', '/services/meta-conversions-api/', '/services/cookie-consent/', '/services/tracking-audit/', '/services/analytics-dashboards/', '/services/ga4-gtm-setup/'];
  for (const href of expectedServices) await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible();
  for (const slug of ['slice','roadsurfer']) {
    await page.goto(`/case-studies/${slug}/`);
    await page.locator('main a[href="/case-studies/"]').click();
    await expect(page).toHaveURL(/\/case-studies\/$/);
  }
});

test('Phase 3 services hub uses the updated portfolio and destinations', async ({page}) => {
  await page.goto('/services/');
  await expect(page.getByRole('heading',{name:'Attribution & Privacy'})).toBeVisible();
  await expect(page.getByRole('heading',{name:'Strategy & Reporting'})).toBeVisible();
  await expect(page.locator('#strategy-reporting a[href="/services/tracking-audit/"]')).toBeVisible();
  await expect(page.locator('#attribution-privacy a[href="/services/tracking-audit/"]')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Key capabilities'}).first()).toBeVisible();
  await expect(page.locator('main')).not.toContainText('Scope');
  const cardOrder = async (group:string) => page.locator(`#${group} [data-service-cards]`).evaluateAll((grids) => grids.flatMap((grid) => Array.from(grid.children, (card) => card.getAttribute('id'))));
  expect(await cardOrder('measurement-implementation')).toEqual(['ga4-gtm-setup','mobile-analytics','server-side-tracking']);
  expect(await cardOrder('attribution-privacy')).toEqual(['meta-conversions-api','mobile-measurement','cookie-consent']);
  const assertCardsAreUniform = async () => {
    for (const group of ['measurement-implementation', 'attribution-privacy', 'strategy-reporting']) {
      const heights = await page.locator(`#${group} [data-service-cards]`).evaluate((grid) => Array.from(grid.children, (card) => card.getBoundingClientRect().height));
      expect(Math.max(...heights) - Math.min(...heights)).toBeLessThanOrEqual(1);
    }
    const buttons = await page.getByRole('link', {name:'View service', exact:true}).evaluateAll((links) => links.map((link) => {
      const {width, height} = link.getBoundingClientRect();
      return `${width.toFixed(1)}x${height.toFixed(1)}`;
    }));
    expect(new Set(buttons).size).toBe(1);
  };
  await assertCardsAreUniform();
  await page.setViewportSize({width:390,height:844});
  await assertCardsAreUniform();
  for (const [label,href] of [['GA4/GTM Setup','/services/ga4-gtm-setup/'],['Mobile Analytics','/services/mobile-analytics/'],['Mobile Measurement','/services/mobile-measurement/'],['Measurement Planning & Architecture Design','/services/measurement-planning/']]) {
    await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible();
    await expect(page.locator('main')).toContainText(label);
  }
  for (const obsolete of ['GA4/GTM Setup (Web)','GA4/GTM Setup (Mobile)','Multi-Touch Attribution','Ecommerce & Funnel Tracking','Custom Funnel Tracking']) await expect(page.locator('main')).not.toContainText(obsolete);
  await expect(page.locator('main a[href="/services/ecommerce-tracking/"]')).toHaveCount(0);
});

test('Mobile Analytics explorer updates its event model and vendor panel by keyboard', async ({page}) => {
  await page.goto('/services/mobile-analytics/');
  for (const vendor of ['Firebase Analytics','Amplitude','Mixpanel','PostHog']) await expect(page.locator(`main img[alt="${vendor} logo"]`)).toBeVisible();
  const explorer=page.locator('#mobile-explorer-title').locator('..');
  const subscription=explorer.getByRole('button',{name:'Subscription'}); await subscription.focus(); await page.keyboard.press('Enter');
  await expect(subscription).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#mobile-event-payload')).toContainText('subscription_started');
  const amplitude=explorer.getByRole('button',{name:'Amplitude'}); await amplitude.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#vendor-capability')).toContainText('funnels, retention and cohort');
  await expect(page.locator('#identity-architecture')).toBeVisible();
  await expect(page.locator('main')).toContainText('QA');
});

test('Mobile Measurement flow updates attribution states accessibly', async ({page}) => {
  await page.goto('/services/mobile-measurement/');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Mobile Measurement & MMP Implementation');
  for (const vendor of ['AppsFlyer','Adjust','Branch','Kochava']) await expect(page.locator(`main img[alt="${vendor} logo"]`)).toBeVisible();
  await page.getByRole('button',{name:'Android'}).focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#mmp-platform-note')).toContainText('Android attribution signals');
  await page.getByRole('button',{name:'Re-engagement'}).click(); await expect(page.locator('[data-step-two]')).toContainText('re-engagement');
  await page.getByRole('button',{name:'Deferred link'}).click(); await expect(page.locator('[data-step-three]')).toContainText('after install');
  await expect(page.locator('main')).toContainText('Mobile Measurement After ATT');
  await expect(page.locator('#mmp-qa')).toBeVisible();
});

test('Measurement Architecture builder changes scenarios and node inspector', async ({page}) => {
  await page.goto('/services/measurement-planning/');
  await expect(page.getByRole('heading',{level:1})).toHaveText('Measurement Planning & Architecture Design');
  for (const scenario of ['Ecommerce','Lead Generation','Mobile App']) {
    const choice=page.getByRole('button',{name:scenario,exact:true}); await choice.click(); await expect(choice).toHaveAttribute('aria-pressed','true');
  }
  await expect(page.locator('[data-stage="Sources"]')).toContainText('App');
  await page.locator('[data-node="Collection"]').click();
  await expect(page.locator('#node-name')).toHaveText('Collection');
  for (const heading of ['Every KPI Needs a Source of Truth','Document Every Important Connection','Architecture Is a Design Decision, Not a Tool List','Plan the Work in Dependent Phases','Make Responsibilities Visible']) await expect(page.getByRole('heading',{name:heading})).toBeVisible();
});

test('service detail explorers and Services navigation progressively enhance', async ({page}) => {
  await page.goto('/services/server-side-tracking/');
  const architecture = page.getByTestId('server-architecture');
  await expect(architecture).toBeVisible();
  await expect(architecture).toContainText('Web GTM');
  await expect(architecture).toContainText('GA4 · Google Ads · Meta');
  await expect(architecture).toContainText('TikTok, Snapchat, other APIs');
  await architecture.getByRole('button',{name:'Browser-only'}).click();
  await expect(architecture).toHaveClass(/is-browser/);
  await expect(architecture).toContainText('Web GTM');
  await expect(architecture).toContainText('Event preparation');
  await expect(architecture).toContainText('GA4 · Google Ads · Meta');
  await expect(architecture).toContainText('TikTok, Snapchat, other APIs');
  await architecture.getByRole('button',{name:'Consent restricted'}).click();
  await expect(architecture).toContainText('Illustrative blocked or limited paths');
  await page.goto('/services/tracking-audit/');
  const workspace=page.getByTestId('audit-workspace'); await workspace.getByRole('button',{name:'Filter severity: High'}).click();
  await workspace.getByRole('button',{name:/transaction_id is missing/}).click();
  await expect(workspace).toContainText('Expose the order identifier');
  await expect(workspace.locator('.audit-status')).toHaveCount(0);
  await page.goto('/services/ga4-gtm-setup/');
  const inspector=page.getByTestId('event-journey-inspector');
  await expect(inspector).toContainText('Checkout completed');
  await inspector.getByRole('tab',{name:'Lead Submitted'}).click();
  await expect(inspector).toContainText('generate_lead');
  await inspector.locator('details summary').click();
  await expect(inspector.locator('[data-payload]')).toContainText('"event": "generate_lead"');
  await inspector.getByRole('tab',{name:'Purchase'}).click();
  await expect(inspector.locator('[data-payload]')).toContainText('"Analytics Cap"');
  await inspector.getByRole('button',{name:'Show broken example'}).click();
  await expect(inspector.locator('[data-qa-value="transaction"]')).toHaveText('missing ✕');
  await expect(inspector.locator('[data-qa-value="transaction"]')).toHaveClass(/text-destructive/);
  await expect(inspector.locator('[data-qa-value="value"]')).toHaveClass(/text-destructive/);
  await expect(inspector.locator('[data-qa-value="items"]')).toHaveClass(/text-destructive/);
  await expect(inspector.locator('[data-qa-value="event"]')).not.toHaveClass(/text-destructive/);
  await inspector.getByRole('button',{name:'Show valid example'}).click();
  await expect(inspector.locator('[data-qa-value="transaction"]')).not.toHaveClass(/text-destructive/);
  await page.goto('/');
  const services=page.locator('#services-menu summary'); await services.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#services-menu')).toHaveAttribute('open',''); await page.keyboard.press('Escape'); await expect(page.locator('#services-menu')).not.toHaveAttribute('open');
  await page.setViewportSize({width:390,height:844}); await page.getByRole('button',{name:'Toggle menu'}).click();
  await page.locator('#mobile-services-menu summary').click(); await expect(page.locator('#mobile-services-menu a[href="/services/server-side-tracking/"]')).toBeVisible();
  await expect(page.locator('#mobile-menu a[href="/services/cookie-consent/"]')).toHaveCount(1);
  await page.goto('/services/cookie-consent/');
  for (const value of ['Top 50','165+','8.8M+','10+']) await expect(page.locator('main')).toContainText(value);
  await expect(page.locator('main img[alt*="Cookiebot"]')).toBeVisible();
});

test('Phase 2 service learning tools update accessible, illustrative states', async ({page}) => {
  await page.goto('/services/meta-conversions-api/');
  const capi = page.getByTestId('meta-capi-flow');
  await expect(capi).toContainText('Deduplication: MATCHED');
  await expect(capi.locator('[data-browser-id]')).toHaveText('ORD-8472');
  await expect(capi.locator('[data-server-id]')).toHaveText('ORD-8472');
  await capi.getByRole('button', {name:'Mismatched event IDs'}).click();
  await expect(capi).toContainText('Deduplication: REVIEW');
  await expect(capi.locator('[data-server-id]')).toHaveText('SERVER-2194');
  await capi.locator('[data-event-select]').selectOption('Lead');
  await expect(capi).toContainText('event_name: Lead');
  await capi.getByText('Inspect server event', {exact:true}).click();
  await expect(capi.locator('[data-server-payload]')).toContainText('"event_name": "Lead"');
  await capi.getByRole('button', {name:'Matched event IDs', exact:true}).focus(); await page.keyboard.press('Enter');
  await expect(capi).toContainText('Deduplication: MATCHED');

  const ecommerceRedirect = await page.request.get('/services/ecommerce-tracking/', { maxRedirects: 0 });
  expect(ecommerceRedirect?.status()).toBe(301);
  expect(ecommerceRedirect.headers().location).toContain('/services/ga4-gtm-setup/');
  await page.goto('/services/ecommerce-tracking/');
  await expect(page).toHaveURL(/\/services\/ga4-gtm-setup\/$/);

  await page.goto('/services/cookie-consent/');
  const consent = page.getByTestId('consent-routing-simulator');
  expect(await consent.locator('[data-consent-signals] dd').allTextContents()).toEqual(['granted','denied','denied','denied']);
  await consent.getByRole('button', {name:'Accept All'}).click();
  expect(await consent.locator('[data-consent-signals] dd').allTextContents()).toEqual(['granted','granted','granted','granted']);
  await expect(consent.locator('[data-tag-routing] dd').nth(2)).toHaveText('Allowed by configured consent rule');
  await consent.getByRole('button', {name:'Analytics Only'}).click();
  expect(await consent.locator('[data-consent-signals] dd').allTextContents()).toEqual(['granted','denied','denied','denied']);
  await consent.getByRole('button', {name:'Reject Non-Essential'}).focus(); await page.keyboard.press('Enter');
  expect(await consent.locator('[data-consent-signals] dd').allTextContents()).toEqual(['denied','denied','denied','denied']);
  await expect(consent.locator('[data-tag-routing] dd').nth(2)).toHaveText('Blocked by configured marketing rule');
  await consent.getByRole('button', {name:'Not detected', exact:true}).click();
  await expect(consent.locator('[data-gpc-route]')).toHaveText('Restricted by detected GPC signal');
});

test('Dashboard demo connects US, UK and DE reporting controls accessibly', async ({page}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/services/analytics-dashboards/');
  await expect(page.locator('h1')).toHaveCount(1);
  const hero = page.locator('[data-dashboard-hero-preview]');
  const dashboard = page.getByTestId('dashboard-demo');
  await expect(hero).toBeVisible();
  await expect(hero.getByRole('button')).toHaveCount(0);
  await expect(dashboard).toBeVisible();
  await expect(dashboard.locator('[data-dashboard-state]')).toHaveCount(0);
  await expect(dashboard.locator('.dashboard-top .dashboard-filters fieldset')).toHaveCount(3);
  await expect(dashboard).toHaveAttribute('data-market', 'US');
  await expect(dashboard.locator('[data-kpi="revenue"]')).toHaveText('$184,240');
  await expect(dashboard.locator('[data-trend-chart]')).toHaveAttribute('aria-label', /Illustrative US.*USD/);
  const initialRevenue = await dashboard.locator('[data-kpi="revenue"]').textContent();
  const initialPath = await dashboard.locator('[data-trend-line]').getAttribute('d');
  const googleBarValue = dashboard.locator('[data-channel-bar="Google Ads"] > div:first-child > span');
  const initialBarValue = await googleBarValue.textContent();
  const initialFunnel = await dashboard.locator('[data-funnel-stage="4"] b').textContent();

  await dashboard.getByRole('button', {name:'UK', exact:true}).click();
  await expect(dashboard).toHaveAttribute('data-market', 'UK');
  await expect(dashboard.locator('[data-kpi="revenue"]')).toHaveText(/£/);
  await expect(dashboard.locator('[data-kpi="revenue"]')).not.toHaveText(initialRevenue ?? '');
  await expect(dashboard.locator('[data-trend-line]')).not.toHaveAttribute('d', initialPath ?? '');
  await expect(dashboard.locator('[data-trend-chart]')).toHaveAttribute('aria-label', /GBP/);
  await expect(dashboard.locator('[data-channel-bar="Google Ads"]')).toContainText(/£/);
  await expect(googleBarValue).not.toHaveText(initialBarValue ?? '');
  await expect(dashboard.locator('[data-funnel-stage="4"] b')).not.toHaveText(initialFunnel ?? '');

  await dashboard.getByRole('button', {name:'DE', exact:true}).click();
  await expect(dashboard.locator('[data-kpi="revenue"]')).toHaveText(/€/);
  await dashboard.getByRole('button', {name:'US', exact:true}).click();
  await expect(dashboard.locator('[data-kpi="revenue"]')).toHaveText('$184,240');

  const beforePeriod = await dashboard.locator('[data-kpi="revenue"]').textContent();
  await dashboard.getByRole('button', {name:'7 days'}).click();
  await expect(dashboard.locator('[data-kpi="revenue"]')).not.toHaveText(beforePeriod ?? '');
  const beforeChannel = await dashboard.locator('[data-kpi="revenue"]').textContent();
  await dashboard.getByRole('button', {name:'Google Ads', exact:true}).click();
  await expect(dashboard).toHaveAttribute('data-channel', 'Google Ads');
  await expect(dashboard.locator('[data-kpi="revenue"]')).not.toHaveText(beforeChannel ?? '');
  await expect(dashboard.locator('[data-dashboard-table] tr')).toHaveCount(1);
  await expect(dashboard.locator('[data-funnel]')).toContainText('100% of sessions');
  await expect(dashboard.locator('[data-channel-bar="Meta"]')).not.toHaveClass(/is-active/);
  await dashboard.locator('[data-trend-index]').nth(3).hover();
  await expect(dashboard.locator('[data-trend-tooltip]')).toBeVisible();
  await expect(dashboard.locator('[data-trend-tooltip]')).toContainText(/\$[\d,]+/);
  await dashboard.locator('[data-channel-bar="Google Ads"]').hover();
  await expect(dashboard.locator('[data-channel-bar="Google Ads"] [data-channel-tooltip]')).toBeVisible();
  await expect(dashboard.locator('[data-channel-bar="Google Ads"] [data-channel-tooltip]')).toContainText(/Revenue \$/);
  await dashboard.locator('[data-funnel-stage="2"]').hover();
  await expect(dashboard.locator('[data-funnel-stage="2"] [data-funnel-tooltip]')).toBeVisible();
  await expect(dashboard.locator('[data-funnel-stage="2"] [data-funnel-tooltip]')).toContainText(/% of previous stage/);
  await dashboard.locator('.dashboard-data-details summary').click();
  await expect(dashboard.locator('[data-trend-summary] dd')).not.toHaveCount(0);

  for (const technology of ['Google Data Studio','BigQuery','Power BI','Snowflake','Amazon Marketing Cloud']) {
    await expect(page.getByTestId('reporting-platforms')).toContainText(technology);
    await expect(page.getByRole('img', {name:`${technology} logo`})).toBeVisible();
  }
  await expect(page.getByRole('img', {name:'Power BI logo'})).toHaveAttribute('src', '/images/tech/power-bi.svg');
  await expect(page.getByRole('img', {name:'Snowflake logo'})).toHaveAttribute('src', '/images/tech/snowflake.svg');
  await expect(hero).toContainText('Illustrative data');
  const answers = await page.locator('[data-dashboard-faq] details > p').allTextContents();
  expect(answers.every(answer => /^(Yes|No)\./.test(answer.trim()))).toBe(true);
  const audit = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();
  expect(audit.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test('Cookie Consent page content, accuracy, accessibility and routing controls', async ({page, browser}) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/services/cookie-consent/');
  await expect(page.locator('h1')).toHaveCount(1);
  for (const proof of ['Top 50','165+','8.8M+','10+']) await expect(page.locator('main')).toContainText(proof);
  await expect(page.getByRole('img', {name:/Cookiebot.*Certified Partner/})).toBeVisible();
  for (const region of ['EU / EEA','United Kingdom','United States']) await expect(page.locator('main')).toContainText(region);
  await expect(page.getByRole('heading', {name:'We Work With Your CMP'})).toBeVisible();
  await expect(page.locator('details summary', {hasText:'Can Upsight work with our existing CMP?'})).toHaveCount(1);
  const consent = page.getByTestId('consent-routing-simulator');
  await expect(consent).toBeVisible();
  await expect(consent).toContainText('Analytics Only');
  await expect(consent).toContainText('Consent-restricted behaviour');
  await expect(page.locator('main')).toContainText('not legal advice');
  for (const concept of ['GDPR','ePrivacy','UK GDPR','PECR','CCPA','GPC','Consent Mode','IAB TCF']) await expect(page.locator('main')).toContainText(concept);
  const body = (await page.locator('main').innerText()).toLowerCase();
  for (const prohibited of [/100% compliant/,/guaranteed compliance/,/stay 100% legal/,/zero leakage/,/maximize accept rate/]) expect(body).not.toMatch(prohibited);
  const audit = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','best-practice']).analyze();
  expect(audit.violations).toEqual([]);

  await consent.getByRole('button', {name:'Accept All'}).click();
  expect(await consent.locator('[data-consent-signals] dd').allTextContents()).toEqual(['granted','granted','granted','granted']);
  await consent.getByRole('button', {name:'Analytics Only'}).focus();
  await page.keyboard.press('Enter');
  expect(await consent.locator('[data-consent-signals] dd').allTextContents()).toEqual(['granted','denied','denied','denied']);
  await consent.getByRole('button', {name:'Reject Non-Essential'}).click();
  expect(await consent.locator('[data-consent-signals] dd').allTextContents()).toEqual(['denied','denied','denied','denied']);
  await consent.getByRole('button', {name:'Not detected'}).click();
  await expect(consent.locator('[data-gpc-route]')).toHaveText('Restricted by detected GPC signal');
  expect(errors).toEqual([]);

  await page.setViewportSize({width:390,height:844});
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);

  const noJsContext = await browser.newContext({javaScriptEnabled:false});
  const noJsPage = await noJsContext.newPage();
  await noJsPage.goto('/services/cookie-consent/');
  await expect(noJsPage.locator('h1')).toHaveCount(1);
  await expect(noJsPage.getByRole('heading', {name:'Privacy Rules Work Differently by Region'})).toBeVisible();
  await expect(noJsPage.getByRole('heading', {name:'We Work With Your CMP'})).toBeVisible();
  await expect(noJsPage.locator('section').filter({has:noJsPage.getByRole('heading', {name:'Cookie Consent Questions'})}).locator('details summary')).toHaveCount(11);
  await expect(noJsPage.getByTestId('consent-routing-simulator').locator('[data-consent-signals] dd')).toHaveText(['granted','denied','denied','denied']);
  await noJsContext.close();
});

test('Contact query opens form; errors, success and repeat submission work', async ({page}) => {
  let count=0;
  await page.route('**/api/contact', async route => {
    const input=route.request().postDataJSON();
    expect(input.turnstileToken).toBe('browser-test-token');
    expect(input.honeypot).toBe('');
    count++;
    await route.fulfill({status:count===1?500:200,json:count===1?{message:'Please try again.'}:{success:true}});
  });
  await page.goto('/contact?form=open');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await expect(page.locator('#contact-form details')).toHaveAttribute('open','');
  await page.getByLabel('Name *', {exact:true}).fill('Browser Test');
  await page.getByLabel('Email *', {exact:true}).fill('test@example.com');
  await page.getByLabel('Phone *', {exact:true}).fill('+1 555 123 4567');
  await page.getByLabel('Message *', {exact:true}).fill('A browser test message.');
  await page.getByRole('button',{name:'Send Message',exact:true}).click();
  await expect(page.getByRole('alert')).toHaveText('Please try again.');
  await page.getByRole('button',{name:'Send Message',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Message Sent Successfully!'})).toBeVisible();
  await expect(page.locator('#contact-form [role=status]')).toBeFocused();
  await page.getByRole('button',{name:'Send Another Message'}).click();
  await expect(page.getByLabel('Name *', {exact:true})).toHaveValue('');
  await page.locator('details[name="contact-faq"]').first().locator('summary').click();
  await expect(page.locator('details[name="contact-faq"]').first()).toHaveAttribute('open','');
});

test('Health Check completes, emails only answers, and resets', async ({page}) => {
  await page.route('**/api/health-check', async route => {
    const input=route.request().postDataJSON();
    expect(Object.keys(input).sort()).toEqual(['answers','email','honeypot','turnstileToken']);
    await route.fulfill({json:{success:true}});
  });
  await page.goto('/health-check/');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await expect(page.getByRole('heading',{level:1,name:'Quick Analytics Health Check',exact:true})).toBeVisible();
  for (const heading of ['What the Health Check evaluates', 'Privacy and limitations', 'Common questions']) {
    await expect(page.getByRole('heading', {name: heading, exact: true})).toHaveCount(0);
  }
  await page.getByRole('button',{name:'Start Health Check'}).click();
  const answers: Record<string,string|string[]>={};
  for (const question of questions) {
    if(question.condition&&!question.condition(answers)) continue;
    await expect(page.locator('#health-question')).toHaveText(question.text);
    if(question.type==='input') {
      await page.getByRole('textbox',{name:question.text}).fill('https://example.com');
      answers[question.id]='https://example.com';
      await page.getByRole('button',{name:'Continue',exact:true}).click();
    } else {
      const option=question.options![0];
      await page.getByRole('button',{name:option.label,exact:true}).click();
      answers[question.id]=question.type==='multi'?[option.value]:option.value;
      if(question.type==='multi') await page.getByRole('button',{name:'Continue',exact:true}).click();
    }
  }
  await expect(page.getByRole('heading',{name:'Your Analytics Health Score',exact:true})).toBeVisible({timeout:15_000});
  const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(audit.violations).toEqual([]);
  await page.getByRole('textbox',{name:'Email address',exact:true}).fill('test@example.com');
  await page.getByRole('button',{name:'Get Report',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Thank You!',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Start over'}).click();
  await expect(page.getByRole('button',{name:'Start Health Check'})).toBeVisible();
});

for (const platform of ['Website Only', 'Mobile app', 'Both']) test(`Health Check progress never regresses for ${platform}`, async ({page}) => {
  await page.goto('/health-check');
  await expect(page.locator('astro-island')).not.toHaveAttribute('ssr');
  await page.getByRole('button',{name:'Start Health Check'}).click();
  const answers: Record<string,string|string[]>={};
  const progress: number[]=[];
  for (const question of questions) {
    if(question.condition&&!question.condition(answers)) continue;
    await expect(page.locator('#health-question')).toHaveText(question.text);
    progress.push(Number(await page.getByRole('progressbar',{name:'Assessment progress'}).getAttribute('aria-valuenow')));
    if(question.type==='input') {
      await page.getByRole('textbox',{name:question.text}).fill('https://example.com');
      answers[question.id]='https://example.com';
      await page.getByRole('button',{name:'Continue',exact:true}).click();
    } else {
      const option=question.id==='q2' ? question.options!.find(item => item.value===platform)! : question.options![0];
      await page.getByRole('button',{name:option.label,exact:true}).click();
      answers[question.id]=question.type==='multi'?[option.value]:option.value;
      if(question.type==='multi') await page.getByRole('button',{name:'Continue',exact:true}).click();
    }
  }
  progress.push(Number(await page.getByRole('progressbar',{name:'Assessment progress'}).getAttribute('aria-valuenow')));
  for(let index=1;index<progress.length;index++) expect(progress[index]).toBeGreaterThanOrEqual(progress[index-1]);
});

test('case-study content is visible without JavaScript', async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  for(const path of ['/case-studies/slice/','/case-studies/roadsurfer/']) {
    await page.goto(`http://127.0.0.1:4322${path}`);
    const headings=page.locator('main h2');
    for(const heading of await headings.all()) await expect(heading).toBeVisible();
    await expect(page.locator('main a[href="/contact"]').first()).toBeVisible();
  }
  await context.close();
});

test('SEO structured data is valid and Slice metrics remain non-zero', async ({page}) => {
  for (const path of ['/services/tracking-audit/', '/services/server-side-tracking/', '/services/ga4-gtm-setup/', '/services/meta-conversions-api/', '/services/mobile-analytics/', '/services/mobile-measurement/', '/services/measurement-planning/', '/services/analytics-dashboards/', '/services/cookie-consent/']) {
    await page.goto(path);
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = schemas.map(schema => JSON.parse(schema));
    expect(parsed.some(schema => schema['@type'] === 'Service')).toBe(true);
    expect(parsed.some(schema => schema['@type'] === 'BreadcrumbList' && schema.itemListElement.every((item: { item: string }) => item.item.endsWith('/')))).toBe(true);
  }
  await page.goto('/case-studies/slice/');
  await expect(page.locator('main')).toContainText('57.91');
  await expect(page.locator('main')).toContainText('130.43');
  await expect(page.locator('main')).toContainText('99');
  await page.goto('/contact/');
  await expect(page.locator('main')).not.toContainText('EST');
});

test('hero pauses offscreen and for reduced motion, and resumes in view', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.addInitScript(() => {
    Reflect.set(window,'heroFrames',0);
    const original=window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame=callback=>{
      if(callback.name==='draw') Reflect.set(window,'heroFrames',Number(Reflect.get(window,'heroFrames'))+1);
      return original(callback);
    };
  });
  await page.goto('/');
  const count=()=>page.evaluate(()=>Number(Reflect.get(window,'heroFrames')));
  await expect.poll(count).toBeGreaterThan(3);
  await page.locator('footer').scrollIntoViewIfNeeded();
  await page.waitForTimeout(150); // Allow IntersectionObserver and the pending frame to settle.
  const stopped=await count(); await page.waitForTimeout(200); expect(await count()).toBe(stopped);
  await page.evaluate(()=>window.scrollTo(0,0));
  await expect.poll(count).toBeGreaterThan(stopped+3);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(150);
  const reduced=await count(); await page.waitForTimeout(200); expect(await count()).toBe(reduced);
});

test('video card is keyboard operable and returns focus to the front', async ({page}) => {
  await page.goto('/case-studies/slice');
  const front=page.getByRole('button',{name:"Watch Alyssa Wong's video testimonial"});
  await front.scrollIntoViewIfNeeded();
  await expect(page.locator('astro-island')).not.toHaveAttribute('ssr');
  await front.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('button',{name:"Play Alyssa Wong's video testimonial",exact:true})).toBeFocused();
  await page.getByRole('button',{name:"Return to Alyssa Wong's testimonial"}).click();
  await expect(front).toBeFocused();
});

test('About testimonials have independent case-study and accessible video controls', async ({page}) => {
  await page.goto('/about');
  const island = page.locator('astro-island[component-url*="VideoTestimonials"]');
  const alyssa = island.getByRole('button', {name:"Watch Alyssa Wong's video testimonial"});
  await alyssa.scrollIntoViewIfNeeded();
  await expect(island).not.toHaveAttribute('ssr');
  await expect(alyssa).toBeVisible();
  await expect(island.getByRole('link', {name:'Read Slice Case Study'})).toHaveAttribute('href', '/case-studies/slice/');
  await alyssa.focus(); await page.keyboard.press('Enter');
  await expect(island.getByRole('button', {name:"Play Alyssa Wong's video testimonial"})).toBeFocused();
  await expect(island.locator('article[aria-hidden="true"]').first()).toHaveAttribute('inert', '');
  await page.keyboard.press('Escape');
  await expect(alyssa).toBeFocused();
  const ashley = island.getByRole('button', {name:"Watch Ashley Stanford's video testimonial"});
  await ashley.click();
  const video = island.locator('video[src="/videos/testimonials/ashley-stanford-testimonial.mp4"]');
  await video.evaluate(element => { const media = element as HTMLVideoElement; let calls = 0; const pause = HTMLMediaElement.prototype.pause; media.pause = () => { calls++; Reflect.set(media, 'pauseCalls', calls); pause.call(media); }; });
  await island.getByRole('button', {name:"Return to Ashley Stanford's testimonial"}).click();
  await expect.poll(() => video.evaluate(element => Number(Reflect.get(element, 'pauseCalls')))).toBeGreaterThan(0);
});

test('Home and About testimonial cards expand from compact quotes to portrait video cards', async ({page}) => {
  for (const path of ['/', '/about']) {
    await page.goto(path);
    const island = page.locator('astro-island[component-url*="VideoTestimonials"]');
    await island.scrollIntoViewIfNeeded();
    await expect(island).not.toHaveAttribute('ssr');
    await expect(island.getByText('Alan Waggoner', { exact: true })).toBeVisible();
    const alyssaVideo = island.locator('video').first();
    await expect(alyssaVideo).toHaveAttribute('poster', '/images/testimonials/alyssa-wong-testimonial-poster.png');
    await expect(alyssaVideo).toHaveClass(/object-contain/);
    const watchAlyssa = island.getByRole('button', { name: "Watch Alyssa Wong's video testimonial" });
    await expect(watchAlyssa).toBeVisible();
    await expect(island.getByRole('button', { name: "Watch Alan Waggoner's video testimonial" })).toBeVisible();
    await expect(island.locator('video[src="/videos/testimonials/alan-waggoner-testimonial.mp4"]')).toHaveAttribute('poster', '/images/testimonials/alan-waggoner-testimonial-poster.png');
    const alyssaCard = island.locator('[data-testimonial-card]').first();
    const quoteCard = await alyssaCard.boundingBox();
    expect(quoteCard?.height).toBeLessThan((quoteCard?.width ?? 0) * 1.5);
    await expect(island.getByText('Partnering with Upsight has been transformational for Slice.', { exact: false })).toBeVisible();
    const watchButtonPositions = await island.getByRole('button', { name: /Watch .* video testimonial/ }).evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().top));
    expect(Math.max(...watchButtonPositions) - Math.min(...watchButtonPositions)).toBeLessThan(2);
    const quoteBox = await alyssaCard.locator('blockquote').boundingBox();
    const actionsBox = await alyssaCard.locator('[data-testimonial-actions]').boundingBox();
    expect((actionsBox?.y ?? 0) - ((quoteBox?.y ?? 0) + (quoteBox?.height ?? 0))).toBeGreaterThan(20);
    await expect(alyssaCard.locator('article[aria-hidden="true"]')).toHaveAttribute('inert', '');
    await expect(alyssaCard).toHaveClass(/transition-\[height,transform\]/);
    await watchAlyssa.click();
    await expect(alyssaCard).toHaveAttribute('data-state', 'video');
    await expect(alyssaVideo).toBeVisible();
    await expect.poll(async () => (await alyssaCard.boundingBox())?.height ?? 0).toBeGreaterThan((quoteCard?.height ?? 0) + 20);
    const videoCard = await alyssaCard.boundingBox();
    expect(videoCard?.height).toBeGreaterThan(quoteCard?.height ?? 0);
    await island.getByRole('button', { name: "Return to Alyssa Wong's testimonial" }).click();
    await expect(alyssaCard).toHaveAttribute('data-state', 'quote');
    await expect.poll(async () => {
      const box = await alyssaCard.boundingBox();
      return box && videoCard ? box.height < videoCard.height - 20 : false;
    }).toBe(true);
  }
});
