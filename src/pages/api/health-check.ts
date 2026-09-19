import type { APIRoute } from "astro";
import { getSecret } from "astro:env/server";
import { healthConfirmationHtml, healthConfirmationText, healthTeamHtml, sendResendEmail, TEAM_EMAIL } from "../../lib/email";
import { calculateScore, type HealthReport } from "../../lib/health-check/domain";
import { healthSubmissionSchema } from "../../lib/health-check/schema";
import { readSubmission, submissionFailure, verifySubmission } from "../../lib/submission-security";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const submission = healthSubmissionSchema.parse(await readSubmission(request));
    await verifySubmission(request, submission, { action: 'health-check', secret: getSecret('TURNSTILE_SECRET_KEY'), development: import.meta.env.DEV, localBypass: getSecret('TURNSTILE_LOCAL_BYPASS') });
    const result = calculateScore(submission.answers);
    const input: HealthReport = { ...result, score: result.total, email: submission.email, answers: submission.answers, websiteUrl: typeof submission.answers.q8 === 'string' ? submission.answers.q8 : undefined };
    const apiKey = getSecret("RESEND_API_KEY");
    if (!apiKey) return Response.json({ message: "Email is temporarily unavailable. Please try again later." }, { status: 503 });

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
        text: healthConfirmationText(input),
      }),
    ]);
    return Response.json({ success: true, message: "Your assessment has been sent." });
  } catch (error) {
    return submissionFailure(error, "We couldn't send the assessment right now. Please try again.");
  }
};
