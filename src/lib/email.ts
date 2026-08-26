export const FROM_EMAIL = "Upsight Digital <notifications@send.upsight.digital>";
export const TEAM_EMAIL = "team@upsight.digital";

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendResendEmail(apiKey: string, payload: {
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
  reply_to?: string | string[];
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from: FROM_EMAIL, ...payload }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Email provider rejected the request (${response.status}). ${detail}`.trim());
  }
  return response.json().catch(() => ({}));
}

export function contactTeamHtml(data: {name:string; email:string; phone?:string; company?:string; message:string}) {
  const name=escapeHtml(data.name), email=escapeHtml(data.email), phone=escapeHtml(data.phone), company=escapeHtml(data.company), message=escapeHtml(data.message).replaceAll("\n", "<br>");
  return `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto"><h2 style="color:#00AD84;border-bottom:2px solid #00AD84;padding-bottom:10px">New Contact Form Submission</h2><table style="width:100%;border-collapse:collapse"><tr><td style="padding:10px;font-weight:bold">Name</td><td style="padding:10px">${name}</td></tr><tr><td style="padding:10px;font-weight:bold">Email</td><td style="padding:10px">${email}</td></tr>${data.phone?`<tr><td style="padding:10px;font-weight:bold">Phone</td><td style="padding:10px">${phone}</td></tr>`:""}${data.company?`<tr><td style="padding:10px;font-weight:bold">Company</td><td style="padding:10px">${company}</td></tr>`:""}</table><h3>Message</h3><div style="background:#f5f5f5;padding:16px;border-radius:8px">${message}</div></div>`;
}

export function contactConfirmationHtml(name: string) {
  const first = escapeHtml(name.trim().split(/\s+/)[0] || name);
  return `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto"><img src="https://upsight.digital/images/logo.png" alt="Upsight Digital" style="max-width:180px;height:auto"><h2 style="color:#111827">Thanks, ${first}. We received your message.</h2><p style="line-height:1.7;color:#374151">An Upsight Digital analytics specialist will review your message and get back to you shortly.</p><p style="line-height:1.7;color:#374151">If you want to choose a time directly, you can <a href="https://calendly.com/team-upsight/30min" style="color:#00AD84">book a free consultation here</a>.</p></div>`;
}

function scoreColor(score:number){return score>=70?'#22c55e':score>=40?'#f59e0b':'#ef4444'}
export function healthTeamHtml(data:any) {
  const risks=(data.risks||[]).map((r:any)=>`<li><strong>${escapeHtml(r.title)}</strong> — ${escapeHtml(r.description)}</li>`).join('');
  const recs=(data.recommendations||[]).map((r:any)=>`<li><strong>${escapeHtml(r.title)}</strong> — ${escapeHtml(r.description)}</li>`).join('');
  const answers=Object.entries(data.answers||{}).map(([k,v])=>`<tr><td style="padding:6px;font-weight:bold">${escapeHtml(k)}</td><td style="padding:6px">${escapeHtml(Array.isArray(v)?v.join(', '):v)}</td></tr>`).join('');
  return `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto"><h2 style="color:#00AD84">New Analytics Health Check</h2><div style="padding:24px;border-radius:12px;background:#111827;color:white;text-align:center"><div style="font-size:46px;font-weight:bold;color:${scoreColor(data.score)}">${data.score}/100</div><div>${escapeHtml(data.maturity)}</div></div><p><strong>Email:</strong> ${escapeHtml(data.email)}</p>${data.websiteUrl?`<p><strong>Website:</strong> ${escapeHtml(data.websiteUrl)}</p>`:""}<h3>Breakdown</h3><table style="width:100%">${Object.entries(data.breakdown||{}).map(([k,v])=>`<tr><td style="padding:6px;text-transform:capitalize">${escapeHtml(k)}</td><td style="padding:6px;font-weight:bold">${escapeHtml(v)}%</td></tr>`).join('')}</table>${risks?`<h3>Top risks</h3><ul>${risks}</ul>`:""}${recs?`<h3>Recommendations</h3><ul>${recs}</ul>`:""}<h3>Answers</h3><table style="width:100%;border-collapse:collapse">${answers}</table></div>`;
}

export function healthConfirmationHtml(data:any) {
  const risks=(data.risks||[]).slice(0,4).map((r:any)=>`<li style="margin-bottom:8px"><strong>${escapeHtml(r.title)}</strong><br><span style="color:#4b5563">${escapeHtml(r.description)}</span></li>`).join('');
  const recs=(data.recommendations||[]).slice(0,4).map((r:any)=>`<li style="margin-bottom:8px"><strong>${escapeHtml(r.title)}</strong><br><span style="color:#4b5563">${escapeHtml(r.description)}</span></li>`).join('');
  return `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto"><h2>Your Analytics Health Score</h2><p>${data.websiteUrl?`Assessment for <strong>${escapeHtml(data.websiteUrl)}</strong>.`:"Thanks for completing the Upsight Digital assessment."}</p><div style="padding:28px;border-radius:14px;background:#111827;color:white;text-align:center"><div style="font-size:52px;font-weight:bold;color:${scoreColor(data.score)}">${data.score}/100</div><div style="font-size:18px">${escapeHtml(data.maturity)}</div></div>${risks?`<h3 style="color:#ef4444">Priority risks</h3><ul>${risks}</ul>`:""}${recs?`<h3 style="color:#00AD84">Recommended next steps</h3><ul>${recs}</ul>`:""}<p style="margin-top:28px"><a href="https://calendly.com/team-upsight/30min" style="display:inline-block;background:#00AD84;color:white;padding:12px 18px;border-radius:8px;text-decoration:none">Book a free consultation</a></p></div>`;
}
