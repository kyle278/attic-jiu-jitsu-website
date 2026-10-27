// Public presentation only; source sessions and booking rules are unchanged.
export const carlowDayKey = (timestamp: string) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Dublin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
export function planEnquiryHref(name: string) {
  return `/?plan=${encodeURIComponent(name)}#trial-form`;
}
