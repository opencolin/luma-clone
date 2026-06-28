import { Calendar, MapPin } from "lucide-react";
import { EventCover } from "@/components/event-cover";
import { Avatar } from "@/components/ui/avatar";

/** Stylized phone showing a mini event page — the hero centerpiece. */
export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] select-none">
      {/* soft glow */}
      <div
        className="absolute -inset-10 -z-10 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(244,63,142,0.35), rgba(99,102,241,0.25), transparent)",
        }}
      />
      <div className="animate-float rounded-[2.6rem] border border-black/10 bg-white p-3 shadow-pop ring-1 ring-black/5">
        <div className="overflow-hidden rounded-[2rem] bg-bg">
          <EventCover
            theme="rose"
            pattern="aurora"
            title="Summer Party at Ocean Beach"
            showTitle
            rounded="rounded-none"
            className="aspect-[4/3] w-full"
          />
          <div className="space-y-3 p-4">
            <div className="flex items-center gap-2 text-[13px] text-ink-secondary">
              <Calendar className="h-4 w-4 text-brand" />
              <span>Saturday, July 18 · 4:00 PM</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-ink-secondary">
              <MapPin className="h-4 w-4 text-brand" />
              <span>Ocean Beach, San Francisco</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <div className="flex -space-x-2">
                {["Ada Chen", "Marco Reyes", "Sora Tanaka"].map((n) => (
                  <div key={n} className="rounded-full ring-2 ring-white">
                    <Avatar name={n} size={26} />
                  </div>
                ))}
              </div>
              <span className="text-[13px] text-ink-tertiary">+128 going</span>
            </div>
            <div className="rounded-xl bg-ink py-2.5 text-center text-sm font-medium text-white">
              One-Click Register
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
