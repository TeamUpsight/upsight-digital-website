import type { HealthReport } from './health-check/domain';

export const FROM_EMAIL = 'Upsight Digital <notifications@send.upsight.digital>';
export const TEAM_EMAIL = 'team@upsight.digital';
const CALENDLY_URL = 'https://calendly.com/team-upsight/30min';
const HEALTH_LOGO_URL = 'https://upsight.digital/images/logo-health-email.png';

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

export async function sendResendEmail(apiKey: string, payload: { to: string | string[]; subject: string; html: string; text?: string; reply_to?: string | string[] }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    // The friendly sender is deliberately final: callers cannot replace it.
    body: JSON.stringify({ ...payload, from: FROM_EMAIL }), signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) { await response.body?.cancel(); throw new Error(`Email provider rejected the request (${response.status}).`); }
  await response.body?.cancel();
}

function emailShell(content: string) {
  return `<!doctype html><html lang="en"><body style="margin:0;padding:0;background:#eef2f3;color:#17212b;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef2f3"><tr><td align="center" style="padding:28px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #dbe3e4;border-radius:16px;overflow:hidden">${brandedHeader()}${content}${emailFooter()}</table></td></tr></table></body></html>`;
}
function brandedHeader() { return `<tr><td style="padding:20px 32px;border-bottom:4px solid #00AD84;background:#ffffff"><img src="${HEALTH_LOGO_URL}" width="172" height="37" alt="Upsight Digital" style="display:block;width:172px;max-width:100%;height:auto;border:0;outline:none"></td></tr>`; }
function emailFooter() { return `<tr><td style="padding:24px 32px;background:#f6f8f8;border-top:1px solid #dbe3e4;color:#5f6b73;font-size:13px;line-height:20px">Upsight Digital<br><a href="https://upsight.digital" style="color:#007f63;text-decoration:none">upsight.digital</a></td></tr>`; }
function healthEmailShell(content: string) {
  return `<!doctype html><html lang="en"><body style="margin:0;padding:0;background:#f4f7f7;color:#17212b;font-family:Arial,Helvetica,sans-serif"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f7f7"><tr><td align="center" style="padding:28px 12px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #dbe3e4;border-radius:16px;overflow:hidden">${brandedHeader()}${content}<tr><td style="padding:24px 32px;background:#ffffff;border-top:1px solid #dbe3e4;color:#5f6b73;font-size:13px;line-height:20px">Upsight Digital<br><a href="https://upsight.digital" style="color:#007f63;text-decoration:none">upsight.digital</a></td></tr></table></td></tr></table></body></html>`;
}
function sectionTitle(title: string) { return `<h2 style="margin:28px 0 12px;color:#17212b;font-size:20px;line-height:28px">${title}</h2>`; }
function ctaButton(label: string) { return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0"><tr><td style="border-radius:8px;background:#00AD84"><a href="${CALENDLY_URL}" style="display:inline-block;padding:13px 20px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none">${label}</a></td></tr></table>`; }
function scoreColor(score: number) { return score >= 70 ? '#16A34A' : score >= 40 ? '#D97706' : '#DC2626'; }
function normalizedPercent(value: number | undefined) { return Math.round(Math.max(0, Math.min(1, value ?? 0)) * 100); }

export function contactTeamHtml(data: { name: string; email: string; phone?: string; company?: string; message: string }) {
  const name = escapeHtml(data.name), email = escapeHtml(data.email), phone = escapeHtml(data.phone), company = escapeHtml(data.company), message = escapeHtml(data.message).replaceAll('\n', '<br>');
  return `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto"><h2 style="color:#00AD84;border-bottom:2px solid #00AD84;padding-bottom:10px">New Contact Form Submission</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:10px;font-weight:bold">Name</td><td style="padding:10px">${name}</td></tr><tr><td style="padding:10px;font-weight:bold">Email</td><td style="padding:10px">${email}</td></tr>${data.phone ? `<tr><td style="padding:10px;font-weight:bold">Phone</td><td style="padding:10px">${phone}</td></tr>` : ''}${data.company ? `<tr><td style="padding:10px;font-weight:bold">Company</td><td style="padding:10px">${company}</td></tr>` : ''}</table><h3>Message</h3><div style="background:#f5f5f5;padding:16px;border-radius:8px">${message}</div></div>`;
}

export function contactConfirmationHtml(name: string) {
  const first = escapeHtml(name.trim().split(/\s+/)[0] || name);
  return emailShell(`<tr><td style="padding:32px"><h1 style="margin:0 0 14px;color:#17212b;font-size:26px;line-height:34px">Thanks, ${first}. We received your message.</h1><p style="margin:0;color:#52616b;font-size:16px;line-height:25px">An Upsight Digital analytics specialist will review your message and get back to you shortly.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px"><tr><td style="padding:16px 18px;background:#ecf8f5;border:1px solid #bde8dd;border-radius:10px;color:#25413e;font-size:14px;line-height:21px"><strong>What happens next</strong><br>We’ll review your goals and current measurement setup before the conversation.</td></tr></table>${ctaButton('Book a Free Consultation')}</td></tr>`);
}
export function contactConfirmationText(name: string) {
  const first = name.trim().split(/\s+/)[0] || name;
  return `Thanks, ${first}. We received your message.\n\nAn Upsight Digital analytics specialist will review it and get back to you shortly.\n\nBook a Free Consultation: ${CALENDLY_URL}\n\nUpsight Digital\nhttps://upsight.digital`;
}

const categories = [
  ['coverage', 'Tracking Coverage'], ['attribution', 'Attribution'], ['reliability', 'Data Reliability'], ['privacy', 'Privacy & Compliance'], ['ownership', 'Ownership'],
] as const;
function categoryBreakdown(data: HealthReport) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${categories.map(([key, label]) => { const percent = normalizedPercent(data.percentages[key]); return `<tr><td style="padding:0 0 14px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding-bottom:6px;color:#25323b;font-size:14px;font-weight:bold">${label}</td><td align="right" style="padding-bottom:6px;color:#007f63;font-size:14px;font-weight:bold">${percent}%</td></tr><tr><td colspan="2" style="height:8px;background:#dfe8e8;border-radius:4px"><div style="width:${percent}%;height:8px;background:#00AD84;border-radius:4px;line-height:8px;font-size:1px">&nbsp;</div></td></tr></table></td></tr>`; }).join('')}</table>`;
}
function insightBlocks(items: Array<{ title: string; description: string }>, color: string, background: string) {
  return items.map((item) => `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 10px"><tr><td style="padding:15px 16px;border-left:4px solid ${color};background:${background};border-radius:0 8px 8px 0"><strong style="color:#17212b;font-size:15px">${escapeHtml(item.title)}</strong><br><span style="color:#52616b;font-size:14px;line-height:20px">${escapeHtml(item.description)}</span></td></tr></table>`).join('');
}

export function healthTeamHtml(data: HealthReport) {
  const answers = Object.entries(data.answers || {}).map(([key, value]) => `<tr><td style="padding:12px;border-bottom:1px solid #dbe3e4;color:#25323b;font-size:14px;font-weight:bold;vertical-align:top">${escapeHtml(key)}</td><td style="padding:12px;border-bottom:1px solid #dbe3e4;color:#52616b;font-size:14px;line-height:20px">${escapeHtml(Array.isArray(value) ? value.join(', ') : value)}</td></tr>`).join('');
  return healthEmailShell(`<tr><td style="padding:32px"><h1 style="margin:0 0 10px;color:#17212b;font-size:26px;line-height:34px">New Analytics Health Check</h1><p style="margin:0;color:#52616b;font-size:15px;line-height:24px">A completed assessment is ready for review.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;background:#ecf8f5;border:1px solid #bde8dd;border-radius:10px"><tr><td style="padding:18px"><strong style="color:#25413e;font-size:15px">${escapeHtml(data.score)}/100 — ${escapeHtml(data.maturity)}</strong><br><span style="display:inline-block;margin-top:5px;color:#52616b;font-size:14px">${escapeHtml(data.email)}</span></td></tr></table>${sectionTitle('Submitted answers')}<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #dbe3e4;border-radius:10px;border-collapse:separate;border-spacing:0">${answers}</table></td></tr>`);
}

export function healthConfirmationHtml(data: HealthReport) {
  const domain = data.websiteUrl ? `Assessment for <strong>${escapeHtml(data.websiteUrl)}</strong>.` : 'Your server-validated assessment results are ready.';
  const improvement = data.improvementEstimation?.length ? `<ul style="margin:0;padding-left:20px;color:#52616b;font-size:14px;line-height:22px">${data.improvementEstimation.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : '';
  return healthEmailShell(`<tr><td style="padding:32px"><h1 style="margin:0 0 8px;color:#17212b;font-size:27px;line-height:35px">Your Analytics Health Score</h1><p style="margin:0;color:#52616b;font-size:15px;line-height:24px">${domain}</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px;background:#ecf8f5;border:1px solid #bde8dd;border-radius:12px"><tr><td align="center" style="padding:25px"><div style="color:${scoreColor(data.score)};font-size:48px;line-height:52px;font-weight:bold">${data.score}<span style="font-size:22px">/100</span></div><div style="margin-top:8px;color:#25413e;font-size:17px">${escapeHtml(data.maturity)} Analytics Maturity</div></td></tr></table>${sectionTitle('Category breakdown')}${categoryBreakdown(data)}${sectionTitle('Priority Risks')}${insightBlocks(data.risks.slice(0, 4), '#DC2626', '#fff7f7')}${sectionTitle('Recommended Next Steps')}${insightBlocks(data.recommendations.slice(0, 4), '#00AD84', '#f2fbf8')}${improvement ? `${sectionTitle('Improvement opportunities')}${improvement}` : ''}${ctaButton('Book a Free Consultation')}</td></tr>`);
}
export function healthConfirmationText(data: HealthReport) {
  const lines = ['Your Analytics Health Score', `${data.score}/100 — ${data.maturity} Analytics Maturity`, data.websiteUrl ? `Assessment for ${data.websiteUrl}` : '', '', 'Category breakdown:', ...categories.map(([key, label]) => `${label}: ${normalizedPercent(data.percentages[key])}%`), '', 'Priority Risks:', ...data.risks.slice(0, 4).map((risk) => `- ${risk.title}: ${risk.description}`), '', 'Recommended Next Steps:', ...data.recommendations.slice(0, 4).map((recommendation) => `- ${recommendation.title}: ${recommendation.description}`), ...(data.improvementEstimation?.length ? ['', 'Improvement opportunities:', ...data.improvementEstimation.map((item) => `- ${item}`)] : []), '', `Book a Free Consultation: ${CALENDLY_URL}`, '', 'Upsight Digital', 'https://upsight.digital'];
  return lines.filter((line, index) => line || index > 1).join('\n');
}
