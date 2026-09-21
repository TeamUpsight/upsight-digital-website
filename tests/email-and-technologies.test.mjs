import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { healthConfirmationHtml, healthConfirmationText, healthTeamHtml, contactConfirmationHtml, contactConfirmationText } from '../src/lib/email.ts';
import { calculateScore } from '../src/lib/health-check/domain.ts';
import { technologyCatalog } from '../src/lib/technologies.ts';

test('technology catalog uses local, color-preserving assets', () => {
  for (const technology of Object.values(technologyCatalog)) {
    assert.match(technology.logo, /^\/images\/tech\//);
    assert.ok(existsSync(`public${technology.logo}`), `${technology.name} logo exists locally`);
  }
  const cookieConsent = readFileSync('src/pages/services/cookie-consent.astro', 'utf8');
  const about = readFileSync('src/components/pages/About.tsx', 'utf8');
  assert.match(cookieConsent, /Usercentrics Cookiebot/);
  assert.match(about, /<TechnologyGrid/);
});

test('customer email templates provide a branded, escaped HTML and plain-text report', () => {
  assert.ok(existsSync('public/images/logo-health-email.png'));
  const result = calculateScore({ q1: 'Ecommerce', q2: 'Website Only', q3: 'GA4 + GTM', q4: ['Social (Facebook, Snapchat, Tiktok, etc.)'], q5: 'Somewhat confident', q6: ['Missing events'], q7: 'Some tracking', q8: 'https://example.com' });
  const report = { ...result, score: result.total, email: 'person@example.com', answers: { q8: 'https://example.com' }, websiteUrl: '<script>alert(1)</script>' };
  const healthHtml = healthConfirmationHtml(report);
  assert.match(healthHtml, /Upsight Digital/);
  assert.match(healthHtml, /Tracking Coverage/);
  assert.match(healthHtml, /Privacy & Compliance/);
  assert.match(healthHtml, /Book a Free Consultation/);
  assert.match(healthHtml, /background:#ecf8f5/);
  assert.doesNotMatch(healthHtml, /background:#101c2a/);
  const logoImage = /<img src="https:\/\/upsight\.digital\/images\/logo-health-email\.png" width="172" height="37" alt="Upsight Digital"/;
  assert.match(healthHtml, logoImage);
  assert.match(healthTeamHtml(report), logoImage);
  assert.match(contactConfirmationHtml('Ada Lovelace'), logoImage);
  assert.doesNotMatch(healthHtml, /Upsight <span style="color:#00AD84">Digital<\/span>/);
  assert.doesNotMatch(healthHtml, /<script>alert/);
  assert.match(healthConfirmationText(report), /Category breakdown[\s\S]*Book a Free Consultation/);
  const contactHtml = contactConfirmationHtml('<img src=x> Ada');
  assert.match(contactHtml, /Thanks, &lt;img\. We received your message\./);
  assert.doesNotMatch(contactHtml, /<img src=x>/);
  assert.match(contactConfirmationText('Ada Lovelace'), /Thanks, Ada\./);
});
