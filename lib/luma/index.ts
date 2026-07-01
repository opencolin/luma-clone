import "server-only";
import { accentFrom } from "@/lib/utils";
import type { CardRow } from "@/lib/view";
import { isLumaConnected, LumaApiError, lumaGet } from "./client";
import type {
  LumaCalendar,
  LumaEvent,
  LumaEventDetail,
  LumaGuestEntry,
  LumaGuestsResponse,
  LumaHost,
  LumaListEventsResponse,
} from "./types";

export { isLumaConnected, LumaApiError };
export type { LumaEvent, LumaHost, LumaCalendar, LumaGuestEntry };

/** The Luma-native slug from an event's public url (falls back to api_id). */
export function lumaSlug(ev: LumaEvent) {
  if (ev.url) {
    const seg = ev.url.split("/").filter(Boolean).pop();
    if (seg) return seg;
  }
  return ev.api_id;
}

function locationName(ev: LumaEvent): string | null {
  if (ev.location_type === "online") return "Online";
  const g = ev.geo_address_json;
  return g?.city_state || g?.address || g?.full_address || null;
}

/** Map a Luma event to the shared card view-model. */
export function lumaEventToCardRow(
  ev: LumaEvent,
  calendarName?: string,
): CardRow {
  return {
    event: {
      slug: `event/${ev.api_id}`,
      title: ev.name,
      coverUrl: ev.cover_url ?? null,
      themeColor: accentFrom(ev.name),
      coverPattern: "aurora",
      startAt: new Date(ev.start_at),
      endAt: ev.end_at ? new Date(ev.end_at) : null,
      timezone: ev.timezone ?? "America/Los_Angeles",
      locationType: ev.location_type === "online" ? "online" : "physical",
      locationName: locationName(ev),
    },
    host: { name: calendarName ?? "Luma", avatarUrl: null },
    calendar: calendarName ? { name: calendarName } : null,
    going: 0,
    source: "luma",
  };
}

/** The calendar the API key is scoped to. Returns null if unconfigured/erroring. */
export async function getConnectedCalendar(): Promise<LumaCalendar | null> {
  if (!isLumaConnected()) return null;
  try {
    const data = await lumaGet<{ calendar: LumaCalendar }>("/calendar/get", {
      revalidate: 600,
    });
    return data.calendar ?? null;
  } catch {
    return null;
  }
}

/** All events on the connected calendar (handles the entry/nested-event shape). */
export async function listCalendarEvents(): Promise<LumaEvent[]> {
  if (!isLumaConnected()) return [];
  const data = await lumaGet<LumaListEventsResponse>(
    "/calendar/list-events",
    { revalidate: 300 },
  );
  return (data.entries ?? []).map((e) => e.event ?? e);
}

/** Split events into upcoming (asc) and past (desc). */
export function splitByTime(events: LumaEvent[]) {
  const now = Date.now();
  const upcoming: LumaEvent[] = [];
  const past: LumaEvent[] = [];
  for (const e of events) {
    const end = new Date(e.end_at ?? e.start_at).getTime();
    (end >= now ? upcoming : past).push(e);
  }
  upcoming.sort((a, b) => +new Date(a.start_at) - +new Date(b.start_at));
  past.sort((a, b) => +new Date(b.start_at) - +new Date(a.start_at));
  return { upcoming, past };
}

/** Single event detail + hosts. Matches by api_id or by public url slug. */
export async function getLumaEvent(
  idOrSlug: string,
): Promise<LumaEventDetail | null> {
  if (!isLumaConnected()) return null;

  // Fast path: api_id lookup
  if (idOrSlug.startsWith("evt-")) {
    try {
      return await lumaGet<LumaEventDetail>("/event/get", {
        params: { api_id: idOrSlug },
        revalidate: 120,
      });
    } catch {
      return null;
    }
  }

  // Otherwise resolve the slug against the calendar list, then fetch detail.
  const events = await listCalendarEvents();
  const match = events.find((e) => lumaSlug(e) === idOrSlug);
  if (!match) return null;
  try {
    return await lumaGet<LumaEventDetail>("/event/get", {
      params: { api_id: match.api_id },
      revalidate: 120,
    });
  } catch {
    return { event: match };
  }
}

/** First page of guests + an approximate count for an event. */
export async function listEventGuests(eventApiId: string): Promise<{
  guests: LumaGuestEntry[];
  count: number;
  hasMore: boolean;
}> {
  if (!isLumaConnected()) return { guests: [], count: 0, hasMore: false };
  try {
    const data = await lumaGet<LumaGuestsResponse>("/event/get-guests", {
      params: { event_api_id: eventApiId },
      revalidate: 120,
    });
    const guests = (data.entries ?? []).map((g) => g.guest ?? g);
    const approved = guests.filter(
      (g) => !g.approval_status || g.approval_status === "approved",
    );
    return {
      guests: approved,
      count: approved.length,
      hasMore: !!data.has_more,
    };
  } catch {
    return { guests: [], count: 0, hasMore: false };
  }
}
