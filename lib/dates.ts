// Timezone-aware formatting via Intl (no extra deps).

function parts(date: Date, tz: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, ...opts }).format(date);
}

/** "Wednesday, June 10" (year added when not the current year). */
export function formatEventDay(start: Date, tz = "America/Los_Angeles") {
  const thisYear = new Date().getFullYear();
  const startYear = Number(parts(start, tz, { year: "numeric" }));
  return parts(start, tz, {
    weekday: "long",
    month: "long",
    day: "numeric",
    ...(startYear !== thisYear ? { year: "numeric" } : {}),
  });
}

/** "10:00 AM – 8:00 PM" or "10:00 AM" when no end. */
export function formatEventTime(
  start: Date,
  end: Date | null,
  tz = "America/Los_Angeles",
) {
  const t = (d: Date) =>
    parts(d, tz, { hour: "numeric", minute: "2-digit", hour12: true });
  const tzAbbr =
    new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" })
      .formatToParts(start)
      .find((p) => p.type === "timeZoneName")?.value ?? "";
  return end ? `${t(start)} – ${t(end)} ${tzAbbr}` : `${t(start)} ${tzAbbr}`;
}

/** Compact date tile: { month: "JUN", day: "10" } */
export function dateTile(start: Date, tz = "America/Los_Angeles") {
  return {
    month: parts(start, tz, { month: "short" }).toUpperCase(),
    day: parts(start, tz, { day: "numeric" }),
  };
}

/** Discover-style grouping label: "Today", "Tomorrow", or weekday + date. */
export function relativeDayLabel(start: Date, tz = "America/Los_Angeles") {
  const fmt = (d: Date) => parts(d, tz, { year: "numeric", month: "2-digit", day: "2-digit" });
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 86_400_000);
  if (fmt(start) === fmt(now)) return "Today";
  if (fmt(start) === fmt(tomorrow)) return "Tomorrow";
  return parts(start, tz, { weekday: "long", month: "long", day: "numeric" });
}

export function isPast(end: Date | null, start: Date) {
  return (end ?? start).getTime() < Date.now();
}
