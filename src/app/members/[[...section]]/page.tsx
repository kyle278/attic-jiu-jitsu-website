import { notFound } from "next/navigation";
import { MemberApp } from "@/components/members/member-app";
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
    !["timetable", "bookings", "membership", "account"].includes(page)
  )
    notFound();
  return (
    <MemberApp
      section={page as "timetable" | "bookings" | "membership" | "account"}
    />
  );
}
