import {
  Activity,
  Cpu,
  Leaf,
  Music,
  Palette,
  Radio,
  Sparkles,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { EventCard } from "@/components/event-card";
import { SiteNav } from "@/components/site-nav";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { listCalendars } from "@/lib/calendars";
import { listEvents } from "@/lib/events";
import {
  getConnectedCalendar,
  isLumaConnected,
  listCalendarEvents,
  lumaEventToCardRow,
  splitByTime,
} from "@/lib/luma";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Discover Events",
  description: "Explore popular events near you, browse by category, and find great communities.",
};

const CATEGORIES = [
  { name: "Tech", icon: Cpu, accent: "blue" },
  { name: "Music", icon: Music, accent: "rose" },
  { name: "Design", icon: Palette, accent: "purple" },
  { name: "Climate", icon: Leaf, accent: "green" },
  { name: "Food & Drink", icon: UtensilsCrossed, accent: "amber" },
  { name: "Fitness", icon: Activity, accent: "teal" },
  { name: "Wellness", icon: Sparkles, accent: "indigo" },
  { name: "Nightlife", icon: Wine, accent: "orange" },
] as const;

const CITIES = [
  "San Francisco", "New York", "Los Angeles", "London", "Austin",
  "Toronto", "Berlin", "Singapore", "Dubai", "Bengaluru", "Paris", "Tokyo",
];

const ACCENT_BG: Record<string, string> = {
  blue: "bg-blue/10 text-blue",
  rose: "bg-rose/10 text-rose",
  purple: "bg-purple/10 text-purple",
  green: "bg-green/10 text-green",
  amber: "bg-amber/10 text-amber",
  teal: "bg-teal/10 text-teal",
  indigo: "bg-indigo/10 text-indigo",
  orange: "bg-orange/10 text-orange",
};

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const connected = isLumaConnected();
  const [events, calendars, lumaEvents, lumaCal] = await Promise.all([
    listEvents({ when: "upcoming", category, limit: 24 }),
    listCalendars(8),
    connected ? listCalendarEvents() : Promise.resolve([]),
    connected ? getConnectedCalendar() : Promise.resolve(null),
  ]);
  const lumaUpcoming = splitByTime(lumaEvents).upcoming.slice(0, 3);

  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl tracking-tight sm:text-4xl">Discover Events</h1>
          <p className="mt-2 text-ink-secondary">
            Explore popular events near you, browse by category, or find a community to join.
          </p>
        </div>

        {/* Live from the connected Luma calendar */}
        {!category && lumaUpcoming.length > 0 && (
          <section className="mb-14">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-0.5 text-[12px] font-medium text-brand">
                  <Radio className="h-3 w-3" />
                  Live from Luma
                </span>
                <h2 className="text-xl">{lumaCal?.name ?? "Your calendar"}</h2>
              </div>
              <Link href="/calendar" className="text-sm text-ink-secondary hover:text-ink">
                View all →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lumaUpcoming.map((ev) => (
                <EventCard
                  key={ev.api_id}
                  row={lumaEventToCardRow(ev, lumaCal?.name)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Popular / filtered events */}
        <section className="mb-14">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl">
              {category ? `${category} Events` : "Popular Events"}
            </h2>
            {category && (
              <Link href="/discover" className="text-sm text-ink-secondary hover:text-ink">
                Clear filter
              </Link>
            )}
          </div>

          {events.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface p-12 text-center">
              <p className="text-ink-secondary">
                No upcoming events{category ? ` in ${category}` : ""} yet.
              </p>
              <ButtonLink href="/create" className="mt-4" size="sm">
                Create one
              </ButtonLink>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((row) => (
                <EventCard key={row.event.id} row={row} />
              ))}
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="mb-14">
          <h2 className="mb-4 text-xl">Browse by Category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.name}
                href={`/discover?category=${encodeURIComponent(c.name)}`}
                className={cn(
                  "flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-all hover:-translate-y-0.5 hover:shadow-card",
                  category === c.name && "ring-2 ring-ink",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    ACCENT_BG[c.accent],
                  )}
                >
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="font-medium text-ink">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured calendars */}
        <section className="mb-14">
          <h2 className="mb-4 text-xl">Featured Calendars</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {calendars.map(({ calendar, events: eventCount }) => (
              <Link
                key={calendar.id}
                href={`/c/${calendar.slug}`}
                className="group rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <Avatar name={calendar.name} src={calendar.avatarUrl} size={44} />
                <h3 className="mt-3 font-medium text-ink">{calendar.name}</h3>
                <p className="mt-1 line-clamp-2 text-[13px] text-ink-secondary">
                  {calendar.description}
                </p>
                <p className="mt-3 text-[13px] text-ink-tertiary">
                  {eventCount} {eventCount === 1 ? "event" : "events"}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Cities */}
        <section>
          <h2 className="mb-4 text-xl">Explore Local Events</h2>
          <div className="flex flex-wrap gap-2.5">
            {CITIES.map((city) => (
              <span
                key={city}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink-secondary"
              >
                {city}
              </span>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
