import {
  CalendarHeart,
  Mail,
  Sparkles,
  Ticket,
  Users,
  Wand2,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { HeroMockup } from "@/components/hero-mockup";
import { SiteNav } from "@/components/site-nav";
import { ButtonLink } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Wand2,
    title: "Beautiful event pages",
    body: "Spin up a stunning page in seconds. Add a cover, details, and your page is ready to share.",
  },
  {
    icon: Mail,
    title: "Invites that convert",
    body: "Send invitations by email and link. Track who's coming with a live guest list.",
  },
  {
    icon: Ticket,
    title: "Free & paid tickets",
    body: "Offer multiple ticket tiers, set capacity, and collect registrations in one flow.",
  },
  {
    icon: Users,
    title: "Approvals & waitlists",
    body: "Review requests to join, cap your guest list, and let a waitlist fill no-shows.",
  },
  {
    icon: CalendarHeart,
    title: "Calendars",
    body: "Group recurring events under a calendar your community can subscribe to.",
  },
  {
    icon: Sparkles,
    title: "Delightful details",
    body: "Live clocks, gorgeous gradients, and the little touches that make events feel special.",
  },
];

export default function Home() {
  return (
    <>
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[480px] opacity-60"
          style={{
            background:
              "radial-gradient(60% 60% at 75% 30%, rgba(244,63,142,0.10), transparent), radial-gradient(50% 50% at 20% 10%, rgba(99,102,241,0.10), transparent)",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-12 sm:px-6 md:grid-cols-2 md:pb-28 md:pt-20">
          <div className="animate-in">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[13px] text-ink-secondary shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              Open-source event platform
            </div>
            <h1 className="text-[44px] leading-[1.05] tracking-[-0.03em] sm:text-[64px]">
              Delightful events
              <br />
              <span className="text-gradient-brand">start here.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-secondary">
              Set up an event page, invite friends and sell tickets. Host a
              memorable event today.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/create" size="lg">
                Create Your First Event
              </ButtonLink>
              <ButtonLink href="/discover" size="lg" variant="secondary">
                Explore Events
              </ButtonLink>
            </div>
          </div>

          <div className="animate-in [animation-delay:120ms]">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl tracking-tight sm:text-4xl">
              Everything you need to host
            </h2>
            <p className="mt-4 text-lg text-ink-secondary">
              From the first invite to the final headcount, Luma handles the
              logistics so you can focus on the gathering.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-line bg-bg p-6 transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center">
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(50% 80% at 50% 0%, rgba(244,63,142,0.35), transparent), radial-gradient(60% 80% at 80% 100%, rgba(99,102,241,0.35), transparent)",
              }}
            />
            <div className="relative">
              <h2 className="text-3xl text-white sm:text-4xl">
                Your next event is one click away
              </h2>
              <p className="mx-auto mt-4 max-w-md text-lg text-white/70">
                Join hosts everywhere bringing people together with Luma.
              </p>
              <div className="mt-8 flex justify-center">
                <ButtonLink href="/create" size="lg" variant="white">
                  Create Your First Event
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
