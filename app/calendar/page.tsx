import { Calendar as CalIcon, Globe, Radio } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { EventCard } from "@/components/event-card";
import { SiteNav } from "@/components/site-nav";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink } from "@/components/ui/button";
import {
  getConnectedCalendar,
  isLumaConnected,
  listCalendarEvents,
  lumaEventToCardRow,
  splitByTime,
} from "@/lib/luma";

export const metadata: Metadata = { title: "My Calendar" };
export const revalidate = 300;

export default async function CalendarPage() {
  if (!isLumaConnected()) return <NotConnected />;

  const [calendar, events] = await Promise.all([
    getConnectedCalendar(),
    listCalendarEvents(),
  ]);

  if (!calendar) return <NotConnected error />;

  const { upcoming, past } = splitByTime(events);
  const name = calendar.name;

  return (
    <>
      <SiteNav />

      {/* Calendar header */}
      <header className="relative">
        <div className="h-44 w-full overflow-hidden sm:h-56">
          {calendar.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={calendar.cover_image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-indigo-400 to-purple-500" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
        </div>

        <div className="mx-auto -mt-12 max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-bg bg-surface shadow-card">
              {calendar.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={calendar.avatar_url} alt={name} className="h-full w-full object-cover" />
              ) : (
                <Avatar name={name} size={96} className="rounded-none" />
              )}
            </div>
            <div className="flex-1 pb-1">
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-0.5 text-[12px] font-medium text-brand">
                <Radio className="h-3 w-3" />
                Connected to Luma
              </div>
              <h1 className="text-3xl tracking-tight sm:text-4xl">{name}</h1>
              {calendar.description && (
                <p className="mt-2 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-ink-secondary line-clamp-3">
                  {calendar.description}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[13px] text-ink-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <CalIcon className="h-4 w-4 text-ink-tertiary" />
                  {events.length} events
                </span>
                {calendar.website && (
                  <a
                    href={calendar.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-ink"
                  >
                    <Globe className="h-4 w-4 text-ink-tertiary" />
                    {calendar.website.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {calendar.slug && (
                  <a
                    href={`https://lu.ma/${calendar.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-ink"
                  >
                    View on lu.ma ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        {upcoming.length > 0 && (
          <Section title="Upcoming Events" count={upcoming.length}>
            {upcoming.map((ev) => (
              <EventCard key={ev.api_id} row={lumaEventToCardRow(ev, name)} />
            ))}
          </Section>
        )}
        {past.length > 0 && (
          <Section title="Past Events" count={past.length} muted>
            {past.map((ev) => (
              <EventCard key={ev.api_id} row={lumaEventToCardRow(ev, name)} />
            ))}
          </Section>
        )}
        {events.length === 0 && (
          <p className="rounded-2xl border border-line bg-surface p-12 text-center text-ink-secondary">
            No events on this calendar yet.
          </p>
        )}
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  count,
  muted,
  children,
}: {
  title: string;
  count: number;
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={muted ? "mt-14" : ""}>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-xl">{title}</h2>
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[12px] font-medium text-ink-secondary">
          {count}
        </span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function NotConnected({ error }: { error?: boolean }) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <Radio className="h-7 w-7" />
        </div>
        <h1 className="text-2xl tracking-tight">
          {error ? "Couldn't reach Luma" : "Connect your Luma calendar"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink-secondary">
          {error
            ? "The Luma API key is set but the request failed. Check that the key is valid and has calendar access."
            : "Add a Luma Plus API key as LUMA_API_KEY in your .env to mirror your real Luma calendar and events here."}
        </p>
        <div className="mt-6 flex gap-3">
          <ButtonLink href="/discover" variant="secondary">
            Explore demo events
          </ButtonLink>
          <a
            className="inline-flex h-10 items-center rounded-[10px] bg-ink px-4 text-sm font-medium text-white hover:bg-[#2b2e33]"
            href="https://docs.lu.ma"
            target="_blank"
            rel="noreferrer"
          >
            Luma API docs
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
