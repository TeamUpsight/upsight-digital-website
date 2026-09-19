import { mkdir, writeFile } from 'node:fs/promises';
import { calculateScore } from '../src/lib/health-check/domain.ts';
import { contactConfirmationHtml, healthConfirmationHtml } from '../src/lib/email.ts';

const answers = { q1: 'Ecommerce', q2: 'Website Only', q3: 'GA4 + GTM', q4: ['Social (Facebook, Snapchat, Tiktok, etc.)'], q5: 'Somewhat confident', q6: ['Missing events'], q7: 'Some tracking', q8: 'https://example.com' };
const result = calculateScore(answers);
const report = { ...result, score: result.total, email: 'example@example.com', answers, websiteUrl: 'https://example.com' };
const output = `<!doctype html><html><body style="margin:0;background:#dfe8e8"><div style="padding:24px 0">${contactConfirmationHtml('Example Person')}</div><div style="padding:24px 0">${healthConfirmationHtml(report)}</div></body></html>`;

await mkdir('test-results/email-fixtures', { recursive: true });
await writeFile('test-results/email-fixtures/customer-emails.html', output);
