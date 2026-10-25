import { notFound } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function MembersPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section = [] } = await params;
  const page = section[0] ?? "timetable";
  if (
    section.length > 1 ||
    !["timetable", "bookings", "membership", "account", "family"].includes(page)
  )
    notFound();
  // The shared layout owns the app and its session across section changes.
  return null;
}
