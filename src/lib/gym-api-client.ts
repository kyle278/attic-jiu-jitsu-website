export type MemberAccessRequestResponse = {
  ok: true;
  delivery_mode: string;
  expires_at: string;
  member_profile_id: string;
  preview_code?: string | null;
  preview_token?: string | null;
};

export type MemberVerificationResponse = {
  ok: true;
  access_token: string;
  expires_at: string;
  member: {
    id: string;
    crm_contact_id: string | null;
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
};

export type MemberSummaryResponse = {
  ok: true;
  summary: {
    member: {
      email: string;
      first_name: string | null;
      last_name: string | null;
      crm_contact_id: string | null;
    };
    memberships: Array<{
      id: string;
      status: string;
      starts_at: string;
      ends_at: string | null;
      remaining_credits: number | null;
      plan: {
        id: string;
        slug: string;
        name: string;
        usage_limit_kind: string;
        usage_limit_count: number | null;
        usage_period_unit: string | null;
      } | null;
    }>;
    bookings: Array<{
      id: string;
      gym_class_session_id: string;
      status: string;
      booked_at: string;
      cancelled_at: string | null;
    }>;
  };
};

export type BookingMutationResponse = {
  ok: true;
  booking: {
    id: string;
    gym_class_session_id: string;
    status: string;
    booked_at: string;
    cancelled_at: string | null;
  };
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as T & { error?: string })
    : ({ error: await response.text() } as T & { error?: string });

  if (!response.ok) {
    throw new Error(
      (payload as { error?: string }).error || `Request failed: ${response.status}`,
    );
  }

  return payload;
}

export function requestMemberAccess(email: string) {
  return requestJson<MemberAccessRequestResponse>("/api/gym/member/request-access", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyMemberAccess(email: string, code: string) {
  return requestJson<MemberVerificationResponse>("/api/gym/member/verify-access", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function fetchMemberSummary(accessToken: string) {
  return requestJson<MemberSummaryResponse>("/api/gym/member/summary", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createBooking(accessToken: string, gymClassSessionId: string) {
  return requestJson<BookingMutationResponse>("/api/gym/bookings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      gym_class_session_id: gymClassSessionId,
    }),
  });
}

export function cancelBooking(accessToken: string, bookingId: string) {
  return requestJson<BookingMutationResponse>(`/api/gym/bookings/${encodeURIComponent(bookingId)}/cancel`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({}),
  });
}
