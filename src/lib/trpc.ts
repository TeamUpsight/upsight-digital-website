type MutationOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
};

function mutation<TInput, TOutput>(endpoint: string, options?: MutationOptions<TOutput>) {
  return {
    async mutateAsync(input: TInput): Promise<TOutput> {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(input),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error((payload as any)?.message || "Request failed. Please try again.");
        }
        options?.onSuccess?.(payload as TOutput);
        return payload as TOutput;
      } catch (error) {
        const normalized = error instanceof Error ? error : new Error("Request failed. Please try again.");
        options?.onError?.(normalized);
        throw normalized;
      }
    },
  };
}

export const trpc = {
  contact: {
    submit: {
      useMutation: <TOutput = any>(options?: MutationOptions<TOutput>) =>
        mutation<any, TOutput>("/api/contact", options),
    },
  },
  healthCheck: {
    generateReport: {
      useMutation: <TOutput = any>(options?: MutationOptions<TOutput>) =>
        mutation<any, TOutput>("/api/health-check", options),
    },
  },
};
