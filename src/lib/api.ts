export async function postJson<TInput, TOutput>(endpoint: string, input: TInput): Promise<TOutput> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as { message?: string })?.message || "Request failed. Please try again.");
  }

  return payload as TOutput;
}

export function submitContact<TOutput = { success: boolean; message?: string }>(input: unknown) {
  return postJson<unknown, TOutput>("/api/contact", input);
}

export function submitHealthCheck<TOutput = { success: boolean; message?: string }>(input: unknown) {
  return postJson<unknown, TOutput>("/api/health-check", input);
}
