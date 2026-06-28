import { CalendarPlus, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/footer";
import { EventCard } from "@/components/event-card";
import { SiteNav } from "@/components/site-nav";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { listAttendingEvents, listHostedEvents } from "@/lib/events";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "My Events" };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/signin?next=/home");

  const { tab } = await searchParams;
  const when = tab === "past" ? "past" : "upcoming";

  const [hosting, attending] = await Promise.all([
    listHostedEvents(user.id, when),
    listAttendingEvents(user.id, user.email, when),
  ]);

  const empty = hosting.length === 0 && attending.length === 0;

  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-ink-secondary">Welcome back</p>
            <h1 className="text-3xl tracking-tight sm:text-4xl">{user.name}</h1>
          </div>
          <ButtonLink href="/create">
            <CalendarPlus className="h-4 w-4" />
            Create Event
          </ButtonLink>
        </div>

        {/* Tabs */}
        <div className="mb-8 inline-flex rounded-xl border border-line bg-surface p-1">
          {(["upcoming", "past"] as const).map((t) => (
            <Link
              key={t}
              href={t === "upcoming" ? "/home" : "/home?tab=past"}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                when === t
                  ? "bg-ink text-white"
                  : "text-ink-secondary hover:text-ink",
              )}
            >
              {t}
            </Link>
          ))}
        </div>

        {empty ? (
          <div className="rounded-2xl border border-line bg-surface p-14 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-xl">No {when} events yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-ink-secondary">
              {when === "upcoming"
                ? "Create your first event or explore what's happening near you."
                : "Events you've hosted or attended will show up here."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <ButtonLink href="/create">Create Event</ButtonLink>
              <ButtonLink href="/discover" variant="secondary">
                Explore Events
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {hosting.length > 0 && (
              <Section title="Hosting" count={hosting.length}>
                {hosting.map((row) => (
                  <div key={row.event.id} className="relative">
                    <EventCard row={row} />
                    <Link
                      href={`/${row.event.slug}/manage`}
                      className="absolute right-3 top-3 z-10 rounded-lg bg-white/95 px-2.5 py-1 text-[12px] font-medium text-ink shadow-sm backdrop-blur transition-colors hover:bg-white"
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </Section>
            )}
            {attending.length > 0 && (
              <Section title="Attending" count={attending.length}>
                {attending.map((row) => (
                  <EventCard key={row.event.id} row={row} />
                ))}
              </Section>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
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
