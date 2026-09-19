import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { z } from "zod";
import { contactConfirmationHtml, contactConfirmationText, contactTeamHtml, sendResendEmail, TEAM_EMAIL } from "../../lib/email";
import { protectionFields, readSubmission, submissionFailure, verifySubmission } from "../../lib/submission-security";

export const prerender = false;

export const schema = z.strictObject({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().max(254).pipe(z.email()),
  phone: z.string().trim().min(8).max(40).regex(/^\+[\d ()-]+$/).refine(value => { const digits = value.replace(/\D/g, '').length; return digits >= 7 && digits <= 15; }),
  company: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10).max(5000),
  ...protectionFields,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const input = schema.parse(await readSubmission(request));
    await verifySubmission(request, input, { action: 'contact', secret: getSecret('TURNSTILE_SECRET_KEY'), development: import.meta.env.DEV, localBypass: getSecret('TURNSTILE_LOCAL_BYPASS') });
    const apiKey = getSecret("RESEND_API_KEY");
    if (!apiKey) return Response.json({ message: "Email is temporarily unavailable. Please email team@upsight.digital." }, { status: 503 });

    const team = sendResendEmail(apiKey, {
      to: TEAM_EMAIL,
      reply_to: input.email,
      subject: `New Contact: ${input.name}${input.company ? ` - ${input.company}` : ""}`,
      html: contactTeamHtml(input),
    });
    const confirmation = sendResendEmail(apiKey, {
      to: input.email,
      subject: "We received your message - Upsight Digital",
      html: contactConfirmationHtml(input.name),
      text: contactConfirmationText(input.name),
    });
    await Promise.all([team, confirmation]);
    return Response.json({ success: true, message: "Thank you for your message! We'll get back to you shortly." });
  } catch (error) {
    return submissionFailure(error, "We couldn't send your message right now. Please email team@upsight.digital.");
  }
};
