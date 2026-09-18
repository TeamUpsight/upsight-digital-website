import { z } from 'zod';

export class SubmissionError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const protectionFields = {
  turnstileToken: z.string().max(2048),
  honeypot: z.string().max(0),
};

/** Bound actual bytes, including chunked bodies; never trust Content-Length alone. */
export async function readSubmission(request: Request, maxBytes = 24 * 1024): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    throw new SubmissionError(415, 'Please submit the form as JSON.');
  }
  const origin = request.headers.get('origin');
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('sec-fetch-site') === 'cross-site') {
    throw new SubmissionError(403, 'Please submit the form from this website.');
  }
  const length = request.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes)) {
    throw new SubmissionError(413, 'The submission is too large.');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new SubmissionError(400, 'Please check your submission.');
  const chunks: Uint8Array[] = [];
  let size = 0;
  let expired = false;
  const timer = setTimeout(() => { expired = true; void reader.cancel().catch(() => {}); }, 10_000);
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (expired) throw new SubmissionError(408, 'The submission timed out. Please try again.');
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new SubmissionError(413, 'The submission is too large.');
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
    catch { throw new SubmissionError(400, 'Please check your submission.'); }
  } finally { clearTimeout(timer); reader.releaseLock(); }
}

const verificationSchema = z.object({ success: z.boolean(), action: z.string().optional(), hostname: z.string().optional() });
export async function verifySubmission(request: Request, input: {turnstileToken: string; honeypot: string}, options: {
  action: 'contact' | 'health-check'; secret?: string; development: boolean; localBypass?: string;
}) {
  if (input.honeypot) throw new SubmissionError(400, 'Please check your submission.');
  const hostname = new URL(request.url).hostname;
  const local = options.development && ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
  if (local && options.localBypass === 'true') return;
  if (!options.secret) throw new SubmissionError(503, 'Verification is temporarily unavailable. Please try again later.');
  if (!input.turnstileToken || input.turnstileToken.length > 2048) {
    throw new SubmissionError(403, 'Please complete the verification and try again.');
  }
  // Production verification is restricted to the site's configured public hosts.
  const hostnames = local ? [hostname] : ['upsight.digital', 'www.upsight.digital'];
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: options.secret, response: input.turnstileToken }),
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) {
      const result = verificationSchema.safeParse(await response.json());
      if (result.success && result.data.success && result.data.action === options.action && hostnames.includes(result.data.hostname ?? '')) return;
    }
  } catch { /* Provider/network failures must fail closed, without logging tokens. */ }
  throw new SubmissionError(403, 'Verification failed. Please try again.');
}

export function submissionFailure(error: unknown, fallback: string): Response {
  if (error instanceof SubmissionError) return Response.json({ message: error.message }, { status: error.status });
  if (error instanceof z.ZodError) return Response.json({ message: 'Please check the form fields and complete verification.' }, { status: 400 });
  // No provider response bodies, visitor data or credentials in logs or responses.
  console.error('Submission delivery failed.');
  return Response.json({ message: fallback }, { status: 500 });
}
