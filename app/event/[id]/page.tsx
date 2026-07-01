import { CalendarDays, ExternalLink, Globe, MapPin, Radio, Users } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventCover } from "@/components/event-cover";
import { Footer } from "@/components/footer";
import { MapBlock } from "@/components/map-block";
import { SiteNav } from "@/components/site-nav";
import { Avatar, AvatarStack } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import { dateTile, formatEventDay, formatEventTime, isPast } from "@/lib/dates";
import {
  getLumaEvent,
  isLumaConnected,
  listEventGuests,
  lumaSlug,
} from "@/lib/luma";
import { accentFrom } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export const revalidate = 120;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const detail = await getLumaEvent(id);
  if (!detail) return { title: "Event not found" };
  return {
    title: detail.event.name,
    description: detail.event.description?.slice(0, 160) || undefined,
  };
}

export default async function LumaEventPage({ params }: Params) {
  const { id } = await params;
  if (!isLumaConnected()) notFound();

  const detail = await getLumaEvent(id);
  if (!detail) notFound();

  const ev = detail.event;
  const hosts = (detail.hosts ?? []).filter((h) => h.name);
  const { guests, count, hasMore } = await listEventGuests(ev.api_id);

  const start = new Date(ev.start_at);
  const end = ev.end_at ? new Date(ev.end_at) : null;
  const tz = ev.timezone ?? "America/Los_Angeles";
  const tile = dateTile(start, tz);
  const past = isPast(end, start);
  const online = ev.location_type === "online";
  const venue = ev.geo_address_json?.address ?? ev.geo_address_json?.city_state ?? null;
  const lumaUrl = ev.url ?? `https://lu.ma/${lumaSlug(ev)}`;

  return (
    <>
      <SiteNav />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-[minmax(0,380px)_1fr] md:gap-10">
          {/* LEFT */}
          <aside className="space-y-5 md:sticky md:top-24 md:self-start">
            <EventCover
              coverUrl={ev.cover_url}
              theme={accentFrom(ev.name)}
              pattern="aurora"
              title={ev.name}
              showTitle={!ev.cover_url}
              className="aspect-square w-full shadow-card"
            />

            {hosts.length > 0 && (
              <div className="rounded-xl border border-line bg-surface/60 p-4">
                <p className="mb-3 text-[13px] font-medium text-ink-tertiary">
                  Hosted By
                </p>
                <div className="space-y-3">
                  {hosts.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <Avatar name={h.name ?? "Host"} src={h.avatar_url} size={28} />
                      <span className="text-sm text-ink">{h.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 px-1 text-[13px] text-ink-tertiary">
              <Radio className="h-3.5 w-3.5 text-brand" />
              Live from Luma
            </div>
          </aside>

          {/* RIGHT */}
          <div className="min-w-0 space-y-6">
            <h1 className="text-[32px] leading-[1.1] tracking-[-0.025em] sm:text-[40px]">
              {ev.name}
            </h1>

            <div className="space-y-3">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 flex-col items-center justify-center overflow-hidden rounded-lg border border-line bg-surface">
                  <span className="w-full bg-surface-2 text-center text-[9px] font-semibold uppercase tracking-wider text-ink-secondary">
                    {tile.month}
                  </span>
                  <span className="flex-1 content-center text-lg font-medium leading-none text-ink">
                    {tile.day}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-ink">{formatEventDay(start, tz)}</p>
                  <p className="text-sm text-ink-secondary">
                    {formatEventTime(start, end, tz)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-surface text-ink-secondary">
                  {online ? <Globe className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-ink">
                    {online ? "Online Event" : (venue ?? "Location shared after registering")}
                  </p>
                  {ev.geo_address_json?.city_state && !online && (
                    <p className="truncate text-sm text-ink-secondary">
                      {ev.geo_address_json.city_state}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Register (links to Luma — no write side-effects on your real calendar) */}
            <div className="card overflow-hidden">
              <div className="border-b border-line bg-surface-2/60 px-5 py-3 text-[13px] font-medium text-ink-secondary">
                {past ? "This event has ended" : "Registration"}
              </div>
              <div className="space-y-4 p-5">
                {count > 0 && (
                  <div className="flex items-center gap-3">
                    {guests.length > 0 && (
                      <AvatarStack
                        names={guests.map((g) => g.name || g.user_name || "Guest")}
                        size={28}
                      />
                    )}
                    <span className="text-sm text-ink-secondary">
                      <Users className="mr-1 inline h-4 w-4 text-ink-tertiary" />
                      {count}
                      {hasMore ? "+" : ""} going
                    </span>
                  </div>
                )}
                <ButtonLink
                  href={lumaUrl}
                  size="lg"
                  className="w-full"
                  variant={past ? "secondary" : "primary"}
                >
                  {past ? "View on Luma" : "Register on Luma"}
                  <ExternalLink className="h-4 w-4" />
                </ButtonLink>
                <p className="text-center text-[12px] text-ink-tertiary">
                  Registration is handled securely on Luma.
                </p>
              </div>
            </div>

            {ev.description && (
              <section>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-tertiary">
                  About Event
                </h2>
                <div className="whitespace-pre-line text-[15px] leading-relaxed text-ink/90">
                  {ev.description}
                </div>
              </section>
            )}

            {!online && venue && (
              <section>
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-tertiary">
                  Location
                </h2>
                <MapBlock name={venue} address={ev.geo_address_json?.city_state} />
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
