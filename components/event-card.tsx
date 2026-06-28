import { CalendarDays, MapPin, Globe } from "lucide-react";
import Link from "next/link";
import { EventCover } from "@/components/event-cover";
import { Avatar } from "@/components/ui/avatar";
import type { EventListItem } from "@/lib/events";
import { dateTile, formatEventTime, isPast } from "@/lib/dates";
import { cn } from "@/lib/utils";

/** Vertical event card used in the Discover grid and dashboards. */
export function EventCard({ row }: { row: EventListItem }) {
  const { event, host, calendar, going } = row;
  const tile = dateTile(event.startAt, event.timezone);
  const past = isPast(event.endAt, event.startAt);

  return (
    <Link
      href={`/${event.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="relative">
        <EventCover
          coverUrl={event.coverUrl}
          theme={event.themeColor}
          pattern={event.coverPattern}
          title={event.title}
          showTitle={!event.coverUrl}
          rounded="rounded-none"
          className={cn("aspect-[16/10] w-full", past && "opacity-80")}
        />
        <div className="absolute left-3 top-3 flex h-12 w-12 flex-col items-center justify-center overflow-hidden rounded-lg bg-white/95 shadow-sm backdrop-blur">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-brand">
            {tile.month}
          </span>
          <span className="text-lg font-medium leading-none text-ink">
            {tile.day}
          </span>
        </div>
        {past && (
          <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
            Past
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-[17px] font-medium leading-snug tracking-tight text-ink">
          {event.title}
        </h3>

        <div className="mt-auto space-y-1.5 pt-1 text-[13px] text-ink-secondary">
          <p className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-ink-tertiary" />
            {formatEventTime(event.startAt, event.endAt, event.timezone)}
          </p>
          <p className="flex items-center gap-1.5">
            {event.locationType === "online" ? (
              <Globe className="h-3.5 w-3.5 shrink-0 text-ink-tertiary" />
            ) : (
              <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-tertiary" />
            )}
            <span className="truncate">
              {event.locationType === "online"
                ? "Online"
                : (event.locationName ?? "TBD")}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 border-t border-line pt-3">
          <Avatar name={host.name} src={host.avatarUrl} size={20} />
          <span className="truncate text-[13px] text-ink-secondary">
            {calendar?.name ?? host.name}
          </span>
          {going > 0 && (
            <span className="ml-auto shrink-0 text-[13px] text-ink-tertiary">
              {going} going
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
