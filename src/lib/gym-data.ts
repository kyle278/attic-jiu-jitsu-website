import {
  classPrograms,
  pricingGroups,
  site,
} from "@/lib/site-data";
import {
  gymClasses as syncedClasses,
  gymConfig as syncedConfig,
  gymManifest as syncedManifest,
  gymPlans as syncedPlans,
  gymSessions as syncedSessions,
} from "@/generated/gym";

type GymAccessRule = {
  rule_type: "all_classes" | "category" | "class_template";
  category_slug: string | null;
  class_template_id: string | null;
};

export type GymSyncMembershipPlan = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  usage_limit_kind: "unlimited" | "capped";
  usage_limit_count: number | null;
  usage_period_unit: "month" | "week" | "day" | null;
  access_rules: GymAccessRule[];
};

export type GymSyncClassTemplate = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_slug: string | null;
  category_label: string | null;
  coach_name: string | null;
  location_name: string | null;
  duration_minutes: number;
  default_capacity: number;
  booking_window_hours: number;
  cancellation_window_hours: number;
};

export type GymSyncClassSession = {
  id: string;
  class_template_id: string;
  starts_at: string;
  ends_at: string;
  remaining_spots: number;
  capacity: number;
  booking_opens_at: string | null;
  booking_closes_at: string | null;
  class_name: string;
  class_slug: string;
  category_slug: string | null;
  category_label: string | null;
  coach_name: string | null;
  location_name: string | null;
  duration_minutes: number;
};

export type GymSiteConfig = {
  contract_version?: string;
  gym_name?: string;
  booking_cta_label?: string;
  plans_heading?: string;
  schedule_heading?: string;
  booking_policy?: string;
  membership_copy?: string;
  display_options?: Record<string, unknown>;
};

type GymManifest = {
  contract_version: string;
  generated_at: string;
  site: {
    id: string;
    name: string;
    slug: string;
  };
  config: GymSiteConfig;
  categories: Array<{
    slug: string;
    label: string;
  }>;
};

const manifest = syncedManifest as GymManifest;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildFallbackPlans(): GymSyncMembershipPlan[] {
  return pricingGroups.flatMap((group) =>
    group.plans.map((plan, index) => ({
      id: `fallback-plan-${slugify(plan.name)}-${index}`,
      slug: slugify(plan.name),
      name: plan.name,
      description: plan.detail,
      usage_limit_kind: "unlimited" as const,
      usage_limit_count: null,
      usage_period_unit: null,
      access_rules: [{ rule_type: "all_classes", category_slug: null, class_template_id: null }],
    })),
  );
}

function buildFallbackClasses(): GymSyncClassTemplate[] {
  return classPrograms.map((program, index) => {
    const lowerTitle = program.title.toLowerCase();
    const categoryLabel = lowerTitle.includes("kids")
      ? "Kids"
      : lowerTitle.includes("teens")
        ? "Teens"
        : lowerTitle.includes("no-gi")
          ? "No-Gi"
          : lowerTitle.includes("sparring")
            ? "Sparring"
            : "Adults";

    return {
      id: `fallback-class-${slugify(program.title)}-${index}`,
      slug: slugify(program.title),
      name: program.title,
      description: program.description,
      category_slug: slugify(categoryLabel),
      category_label: categoryLabel,
      coach_name: null,
      location_name: site.city,
      duration_minutes: 60,
      default_capacity: 0,
      booking_window_hours: 168,
      cancellation_window_hours: 24,
    };
  });
}

const resolvedPlans =
  (syncedPlans as GymSyncMembershipPlan[]).length > 0
    ? (syncedPlans as GymSyncMembershipPlan[])
    : buildFallbackPlans();

const resolvedClasses =
  (syncedClasses as GymSyncClassTemplate[]).length > 0
    ? (syncedClasses as GymSyncClassTemplate[])
    : buildFallbackClasses();

const resolvedSessions = syncedSessions as GymSyncClassSession[];

const localPriceLookup = new Map(
  pricingGroups.flatMap((group) =>
    group.plans.map((plan) => [
      slugify(plan.name),
      {
        price: plan.price,
        detail: plan.detail,
        audience: group.title,
      },
    ]),
  ),
);

export const gymManifest = manifest;
export const gymConfig: GymSiteConfig = {
  gym_name: site.title,
  plans_heading: "Membership options",
  schedule_heading: "Live schedule",
  booking_policy:
    "Run the Attic gym sync against the portal once the gym routes are available to publish live session times and availability here.",
  membership_copy:
    "Member access lives inside the site so existing students can check active plans, recent bookings, and class access without leaving the Attic experience.",
  ...(syncedConfig as GymSiteConfig),
};
export const gymPlans = resolvedPlans;
export const gymClasses = resolvedClasses;
export const gymSessions = resolvedSessions;

export function getPlanPriceDetails(slug: string) {
  return localPriceLookup.get(slug);
}

export function getClassCards() {
  const sessionCounts = new Map<string, number>();

  for (const session of gymSessions) {
    sessionCounts.set(
      session.class_template_id,
      (sessionCounts.get(session.class_template_id) ?? 0) + 1,
    );
  }

  return [...gymClasses].sort((left, right) => left.name.localeCompare(right.name)).map((item) => ({
    ...item,
    upcoming_sessions: sessionCounts.get(item.id) ?? 0,
  }));
}

export function getMembershipCards() {
  return [...gymPlans].sort((left, right) => left.name.localeCompare(right.name)).map((plan) => ({
    ...plan,
    price: getPlanPriceDetails(plan.slug)?.price ?? "Talk to the team",
    detail: getPlanPriceDetails(plan.slug)?.detail ?? plan.description ?? "Membership details are confirmed inside the academy.",
    audience: getPlanPriceDetails(plan.slug)?.audience ?? "Membership",
  }));
}

export function getScheduleDays() {
  const dayFormatter = new Intl.DateTimeFormat("en-IE", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const days = new Map<
    string,
    {
      label: string;
      sessions: GymSyncClassSession[];
    }
  >();

  for (const session of [...gymSessions].sort((left, right) => left.starts_at.localeCompare(right.starts_at))) {
    const key = session.starts_at.slice(0, 10);
    const label = dayFormatter.format(new Date(session.starts_at));
    const current = days.get(key);

    if (current) {
      current.sessions.push(session);
      continue;
    }

    days.set(key, {
      label,
      sessions: [session],
    });
  }

  return Array.from(days.entries()).map(([dateKey, value]) => ({
    dateKey,
    label: value.label,
    sessions: value.sessions,
  }));
}
