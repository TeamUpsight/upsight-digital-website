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
}

test.beforeEach(async ({page}) => { await mockVerification(page); });

for (const path of ['/', '/services', '/services/cookie-consent', '/who-its-for', '/process', '/about', '/case-studies', '/case-studies/slice', '/case-studies/roadsurfer', '/contact', '/health-check', '/404']) {
  test(`semantic HTML, assets and accessibility: ${path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(path);
    await expect(page.locator('astro-island[client="load"][ssr]')).toHaveCount(0);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('a button, button a, a a, button button')).toHaveCount(0);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', `https://upsight.digital${path}`);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /hero_analytics_abstract\.webp$/);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']).analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
    if (path === '/case-studies/roadsurfer') await expect(page.locator('astro-island')).toHaveCount(0);
    if (path === '/case-studies/slice') {
      await expect(page.locator('astro-island')).toHaveCount(1);
      await expect(page.locator('astro-island')).toHaveAttribute('component-url', /SliceVideo/);
    }
  });
}

test('keyboard navigation, Resources, skip link and mobile menu', async ({page}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name:'Skip to main content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  const resources=page.locator('#resources-menu summary');
  await resources.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('#resources-menu')).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(page.locator('#resources-menu a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(resources).toBeFocused();
  await expect(page.locator('#resources-menu')).not.toHaveAttribute('open');
  await page.setViewportSize({width:390,height:844});
  const mobileMenu = page.locator('#mobile-menu');
  const mobileServices = page.locator('#mobile-menu a[href="/services"]');
  await expect(mobileServices).toHaveCount(1);
  await expect(mobileMenu).toHaveAttribute('inert','');
  await expect(mobileServices).toBeHidden();
  await page.getByRole('button',{name:'Toggle menu'}).focus();
  await page.keyboard.press('Tab');
  await expect(mobileMenu.locator(':focus')).toHaveCount(0);
  await page.getByRole('button',{name:'Toggle menu'}).click();
  await expect(page.locator('#mobile-menu-button')).toHaveAttribute('aria-expanded','true');
  await expect(mobileMenu).not.toHaveAttribute('inert');
  await expect(mobileServices).toBeVisible();
  await mobileServices.focus();
  await expect(mobileServices).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu-button')).toHaveAttribute('aria-expanded','false');
  await expect(mobileMenu).toHaveAttribute('inert','');
  await expect(page.locator('#mobile-menu-button')).toBeFocused();
  await expect(mobileServices).toBeHidden();
  await page.getByRole('button',{name:'Toggle menu'}).click();
  await page.locator('#mobile-menu').getByRole('link',{name:'Services',exact:true}).click();
  await expect(page).toHaveURL(/\/services$/);
});

test('service cards, hash anchors and case-study back links', async ({page}) => {
  await page.goto('/');
  const serviceLink=page.locator('main a[href^="/services#"]').first();
  const href=await serviceLink.getAttribute('href');
  await serviceLink.click();
  expect(new URL(page.url()).pathname+new URL(page.url()).hash).toBe(href);
  await expect(page.locator(new URL(page.url()).hash)).toBeInViewport();
  const target = page.locator(new URL(page.url()).hash);
  await expect(target).toHaveCSS('animation-name', 'target-arrival');
  await page.waitForTimeout(2300);
  await expect(target).not.toHaveCSS('box-shadow', /0, 173, 132/);
  const settledBorder = await target.evaluate(element => getComputedStyle(element).borderColor);
  await target.hover();
  await expect.poll(() => target.evaluate(element => getComputedStyle(element).borderColor)).not.toBe(settledBorder);
  for (const slug of ['slice','roadsurfer']) {
    await page.goto(`/case-studies/${slug}`);
    await page.locator('main a[href="/case-studies"]').click();
    await expect(page).toHaveURL(/\/case-studies$/);
  }
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
  await page.goto('/health-check');
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
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

test('case-study content is visible without JavaScript', async ({browser}) => {
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  for(const path of ['/case-studies/slice','/case-studies/roadsurfer']) {
    await page.goto(`http://127.0.0.1:4322${path}`);
    const headings=page.locator('main h2');
    for(const heading of await headings.all()) await expect(heading).toBeVisible();
    await expect(page.locator('main a[href="/contact"]').first()).toBeVisible();
  }
  await context.close();
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
  const front=page.getByRole('button',{name:'Watch Alyssa Wong’s video testimonial'});
  await front.scrollIntoViewIfNeeded();
  await expect(page.locator('astro-island')).not.toHaveAttribute('ssr');
  await front.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('button',{name:'Play video',exact:true})).toBeFocused();
  await page.getByRole('button',{name:'Return to testimonial'}).click();
  await expect(front).toBeFocused();
});
