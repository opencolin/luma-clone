import { and, count, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { calendars, calendarSubscriptions, events } from "@/db/schema";

export async function listCalendars(limit = 12) {
  return db
    .select({
      calendar: calendars,
      events: count(events.id),
    })
    .from(calendars)
    .leftJoin(events, eq(events.calendarId, calendars.id))
    .groupBy(calendars.id)
    .limit(limit);
}

export async function getCalendarBySlug(slug: string) {
  const calendar = await db
    .select()
    .from(calendars)
    .where(eq(calendars.slug, slug))
    .get();
  if (!calendar) return null;

  const subs = await db
    .select({ c: count() })
    .from(calendarSubscriptions)
    .where(eq(calendarSubscriptions.calendarId, calendar.id))
    .get();

  const upcoming = await db
    .select({ c: count() })
    .from(events)
    .where(
      and(
        eq(events.calendarId, calendar.id),
        gte(events.startAt, new Date()),
      ),
    )
    .get();

  return {
    ...calendar,
    subscriberCount: subs?.c ?? 0,
    upcomingCount: upcoming?.c ?? 0,
  };
}

export async function isSubscribed(calendarId: string, userId: string) {
  const row = await db
    .select()
    .from(calendarSubscriptions)
    .where(
      and(
        eq(calendarSubscriptions.calendarId, calendarId),
        eq(calendarSubscriptions.userId, userId),
      ),
    )
    .get();
  return !!row;
}
