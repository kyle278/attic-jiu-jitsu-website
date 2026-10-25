export function GET() {
  return Response.json(
    {
      id: "/members/",
      name: "Attic Jiu Jitsu Members",
      short_name: "Attic Members",
      description: "Book your next class and manage your training.",
      start_url: "/members/timetable",
      scope: "/members/",
      display: "standalone",
      background_color: "#f5f6f8",
      theme_color: "#c43148",
      icons: [
        {
          src: "/images/logo.png",
          sizes: "1205x1205",
          type: "image/png",
          purpose: "any",
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
