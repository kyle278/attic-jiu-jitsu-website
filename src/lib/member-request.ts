export class MemberError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function request<T>(
  action: string,
  input: object = {},
  key?: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch("/members/api", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: JSON.stringify({ action, input }),
  }).catch((cause) => {
    if (cause instanceof Error && cause.name === "AbortError") throw cause;
    throw new MemberError("Connection lost. Reconnect and try again.", 503);
  });
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new MemberError(
      data?.error || "We couldn’t complete that request. Try again.",
      response.status,
    );
  return data as T;
}
