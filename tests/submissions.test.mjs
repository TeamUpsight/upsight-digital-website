import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadEndpoint } from './load-endpoint.mjs';
import { readSubmission, verifySubmission } from '../src/lib/submission-security.ts';
import { calculateScore } from '../src/lib/health-check/domain.ts';

const contact = await loadEndpoint('src/pages/api/contact.ts');
const health = await loadEndpoint('src/pages/api/health-check.ts');
const fixture = JSON.parse(readFileSync(new URL('./fixtures/health-check.json', import.meta.url)))[0];
const contactInput = { name: 'Test <Person>', email: 'visitor@example.com', phone: '+1 555 123 4567', message: 'A <script>test</script> message.', turnstileToken: 'fresh-token', honeypot: '' };
const healthInput = { email: 'visitor@example.com', answers: fixture.answers, turnstileToken: 'fresh-token', honeypot: '' };
const request = (path, body, headers = {}) => new Request('https://upsight.digital/api/' + path, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });
const json = data => Response.json(data);

test('contact sends both emails, escapes HTML and preserves reply-to', async t => {
  const messages = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    assert.ok(init.signal, 'external calls have a deadline');
    if (String(url).includes('siteverify')) return json({ success: true, action: 'contact', hostname: 'upsight.digital' });
    assert.equal(url, 'https://api.resend.com/emails');
    messages.push(JSON.parse(init.body)); return json({ id: 'test' });
  });
  const result = await contact.POST({ request: request('contact', contactInput) });
  assert.equal(result.status, 200);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].reply_to, contactInput.email);
  assert.equal(messages[1].to, contactInput.email);
  assert.match(messages[0].html, /&lt;script&gt;/);
  assert.doesNotMatch(messages[0].html, /<script>/);
});

test('health report is recomputed from answers; both emails use original score', async t => {
  const messages = [];
  t.mock.method(globalThis, 'fetch', async (url, init) => {
    if (String(url).includes('siteverify')) return json({ success: true, action: 'health-check', hostname: 'upsight.digital' });
    messages.push(JSON.parse(init.body)); return json({ id: 'test' });
  });
  assert.equal((await health.POST({ request: request('health-check', healthInput) })).status, 200);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].reply_to, healthInput.email);
  const score = calculateScore(fixture.answers).total;
  for (const message of messages) assert.ok(message.subject.includes(`${score}/100`));
});

for (const [label, patch] of [
  ['forged score', { score: 100 }], ['forged report', { risks: [{title: 'Forged'}] }],
  ['honeypot', { honeypot: 'robot' }], ['unknown question', { answers: {...fixture.answers, other: 'value'} }],
  ['missing answers', { answers: {} }], ['invalid answer', { answers: {...fixture.answers, q1: 'forged'} }],
  ['duplicate multi answers', { answers: {...fixture.answers, q6: ['Missing events', 'Missing events']} }],
  ['oversized answer', { answers: {...fixture.answers, q8: 'x'.repeat(2049)} }],
  ['unsafe URL', { answers: {...fixture.answers, q8: 'javascript://example.com'} }],
  ['array overflow', { answers: {...fixture.answers, q4: Array(7).fill('x')} }],
]) test(`rejects ${label} before external calls`, async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => { throw Error('Must not call providers'); });
  assert.equal((await health.POST({ request: request('health-check', { ...healthInput, ...patch }) })).status, 400);
  assert.equal(fetch.mock.callCount(), 0);
});

for (const [label, verification] of [
  ['invalid token', {success: false}], ['wrong action', {success: true, action: 'health-check', hostname: 'upsight.digital'}],
  ['wrong hostname', {success: true, action: 'contact', hostname: 'attacker.example'}],
  ['malformed result', {success: 'true'}],
]) test(`Turnstile rejects ${label}`, async t => {
  const fetch = t.mock.method(globalThis, 'fetch', async () => json(verification));
  assert.equal((await contact.POST({request: request('contact', contactInput)})).status, 403);
  assert.equal(fetch.mock.callCount(), 1);
});

test('a replayed token fails before sending further emails', async t => {
  let verified = false, emails = 0;
  t.mock.method(globalThis, 'fetch', async url => {
    if (String(url).includes('siteverify')) {
      const success = !verified; verified = true;
      return json({ success, action: 'contact', hostname: 'upsight.digital' });
    }
    emails++; return json({id:'test'});
  });
  assert.equal((await contact.POST({request: request('contact', contactInput)})).status, 200);
  assert.equal((await contact.POST({request: request('contact', contactInput)})).status, 403);
  assert.equal(emails, 2);
});

test('provider errors and network failures do not leak details', async t => {
  t.mock.method(console, 'error', () => {});
  t.mock.method(globalThis, 'fetch', async url => String(url).includes('siteverify')
    ? json({success:true,action:'contact',hostname:'upsight.digital'})
    : new Response('PRIVATE_PROVIDER_DETAIL', {status:500}));
  const response = await contact.POST({request:request('contact',contactInput)});
  assert.equal(response.status,500);
  assert.doesNotMatch(await response.text(),/PRIVATE_PROVIDER_DETAIL|test-resend/);
});

test('verification timeout/network failure fails closed', async t => {
  t.mock.method(globalThis, 'fetch', async () => { throw new DOMException('Timeout', 'TimeoutError'); });
  assert.equal((await contact.POST({request:request('contact',contactInput)})).status,403);
});

test('malformed JSON, cross-site requests and oversized streams are rejected', async () => {
  await assert.rejects(readSubmission(request('contact','{')), {status:400});
  await assert.rejects(readSubmission(request('contact',{}, {'content-type':'text/plain'})), {status:415});
  await assert.rejects(readSubmission(request('contact',{}, {origin:'https://attacker.example'})), {status:403});
  await assert.rejects(readSubmission(request('contact',{}, {'content-length':'999999'})), {status:413});
  await assert.rejects(readSubmission(request('contact','x'.repeat(25000))), {status:413});
});

test('local bypass requires explicit opt-in, development mode AND loopback', async () => {
  const local = new Request('http://localhost:4321/api/contact');
  const input = {turnstileToken:'',honeypot:''};
  await verifySubmission(local,input,{action:'contact',development:true,localBypass:'true'});
  await assert.rejects(verifySubmission(local,input,{action:'contact',development:false,localBypass:'true'}),{status:503});
  await assert.rejects(verifySubmission(local,input,{action:'contact',development:true}),{status:503});
  await assert.rejects(verifySubmission(new Request('https://upsight.digital/api/contact'),input,{action:'contact',development:true,localBypass:'true'}),{status:503});
});
