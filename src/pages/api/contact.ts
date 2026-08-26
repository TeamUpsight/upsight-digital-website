import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { z } from "zod";
import { contactConfirmationHtml, contactTeamHtml, sendResendEmail, TEAM_EMAIL } from "../../lib/email";

export const prerender = false;

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(40),
  company: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10).max(5000),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const input = schema.parse(await request.json());
    const apiKey = getSecret("RESEND_API_KEY");
    if (!apiKey) return Response.json({ message: "Email service is not configured yet. Add RESEND_API_KEY to Cloudflare (or .env locally)." }, { status: 503 });

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
    });
    await Promise.all([team, confirmation]);
    return Response.json({ success: true, message: "Thank you for your message! We'll get back to you shortly." });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ message: error.issues[0]?.message || "Please check the form fields." }, { status: 400 });
    console.error("[contact]", error);
    return Response.json({ message: "We couldn't send your message right now. Please email team@upsight.digital." }, { status: 500 });
  }
};
