import { portalConnect, portalGymBaseUrls } from "@/lib/portal-connect";

function buildPortalUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/+$/, "")}${path}`;
}

export async function fetchPortalGym(path: string, init: RequestInit) {
  let lastError: Error | null = null;

  for (const baseUrl of portalGymBaseUrls) {
    const url = buildPortalUrl(baseUrl, path);

    try {
      const response = await fetch(url, {
        ...init,
        cache: "no-store",
      });

      if (response.status === 404 && baseUrl !== portalGymBaseUrls.at(-1)) {
        continue;
      }

      return {
        response,
        baseUrl,
      };
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error(`Unable to reach portal base URL: ${baseUrl}`);
    }
  }

  throw (
    lastError ??
    new Error("The configured portal base URLs are unavailable for gym requests.")
  );
}

export async function jsonProxyResponse(
  response: Response,
  fallbackMessage: string,
  baseUrl: string,
) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "X-Portal-Base-Url": baseUrl,
      },
    });
  }

  return Response.json(
    {
      error:
        response.status === 404
          ? "Gym portal routes are not available on the configured portal yet."
          : fallbackMessage,
      portal_status: response.status,
    },
    {
      status: response.status,
      headers: {
        "X-Portal-Base-Url": baseUrl,
      },
    },
  );
}

export function buildSiteScopedBody(payload: Record<string, unknown>) {
  return JSON.stringify({
    ...payload,
    site_id: portalConnect.siteId,
  });
}
