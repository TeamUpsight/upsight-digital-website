import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { z } from "zod";
import { healthConfirmationHtml, healthTeamHtml, sendResendEmail, TEAM_EMAIL } from "../../lib/email";

export const prerender = false;

const schema = z.object({
  email: z.string().trim().email().max(254),
  score: z.number().min(0).max(100),
  maturity: z.string().max(100),
  breakdown: z.object({ reliability: z.number(), coverage: z.number(), attribution: z.number(), privacy: z.number(), ownership: z.number() }),
  risks: z.array(z.object({ title: z.string(), description: z.string(), severity: z.string() })).max(20),
  recommendations: z.array(z.object({ title: z.string(), description: z.string(), impact: z.string(), link: z.string() })).max(20),
  improvementEstimation: z.array(z.string()).max(20),
  answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  websiteUrl: z.string().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const input = schema.parse(await request.json());
    const apiKey = getSecret("RESEND_API_KEY");
    if (!apiKey) return Response.json({ message: "Email service is not configured yet. Add RESEND_API_KEY to Cloudflare (or .env locally)." }, { status: 503 });

    await Promise.all([
      sendResendEmail(apiKey, {
        to: TEAM_EMAIL,
        reply_to: input.email,
        subject: `Health Check: ${input.score}/100 - ${input.maturity} (${input.email})`,
        html: healthTeamHtml(input),
      }),
      sendResendEmail(apiKey, {
        to: input.email,
        subject: `Your Analytics Health Score: ${input.score}/100`,
        html: healthConfirmationHtml(input),
      }),
    ]);
    return Response.json({ success: true, message: "Your assessment has been sent." });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ message: error.issues[0]?.message || "Please check your assessment data." }, { status: 400 });
    console.error("[health-check]", error);
    return Response.json({ message: "We couldn't send the assessment right now. Please try again." }, { status: 500 });
  }
};
