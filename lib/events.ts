import { and, asc, count, desc, eq, gte, inArray, lt, ne, or } from "drizzle-orm";
import { db } from "@/db";
import {
  calendars,
  eventHosts,
  events,
  registrations,
  tickets,
  users,
} from "@/db/schema";

/** Shared select shape so every list reuses <EventCard />. */
function baseEventQuery() {
  return db
    .select({
      event: events,
      host: users,
      calendar: calendars,
      going: count(registrations.id),
    })
    .from(events)
    .innerJoin(users, eq(users.id, events.hostId))
    .leftJoin(calendars, eq(calendars.id, events.calendarId))
    .leftJoin(
      registrations,
      and(
        eq(registrations.eventId, events.id),
        eq(registrations.status, "going"),
      ),
    )
    .groupBy(events.id);
}

export type EventListItem = Awaited<ReturnType<typeof listEvents>>[number];

/** Public events for Discover / calendar pages. */
export async function listEvents(opts?: {
  when?: "upcoming" | "past";
  calendarId?: string;
  category?: string;
  limit?: number;
}) {
  const { when = "upcoming", calendarId, category, limit = 100 } = opts ?? {};
  const now = new Date();

  const conds = [eq(events.visibility, "public")];
  if (when === "upcoming") conds.push(gte(events.startAt, now));
  if (when === "past") conds.push(lt(events.startAt, now));
  if (calendarId) conds.push(eq(events.calendarId, calendarId));
  if (category) conds.push(eq(events.category, category));

  const rows = await db
    .select({
      event: events,
      host: users,
      calendar: calendars,
      going: count(registrations.id),
    })
    .from(events)
    .innerJoin(users, eq(users.id, events.hostId))
    .leftJoin(calendars, eq(calendars.id, events.calendarId))
    .leftJoin(
      registrations,
      and(
        eq(registrations.eventId, events.id),
        eq(registrations.status, "going"),
      ),
    )
    .where(and(...conds))
    .groupBy(events.id)
    .orderBy(when === "past" ? desc(events.startAt) : asc(events.startAt))
    .limit(limit);

  return rows;
}

/** Events the user hosts (includes unlisted). */
export async function listHostedEvents(
  userId: string,
  when: "upcoming" | "past",
) {
  const now = new Date();
  return baseEventQuery()
    .where(
      and(
        eq(events.hostId, userId),
        when === "upcoming" ? gte(events.startAt, now) : lt(events.startAt, now),
      ),
    )
    .orderBy(when === "past" ? desc(events.startAt) : asc(events.startAt));
}

/** Events the user registered for (matched by user id or email). */
export async function listAttendingEvents(
  userId: string,
  email: string,
  when: "upcoming" | "past",
) {
  const now = new Date();
  const regRows = await db
    .selectDistinct({ eventId: registrations.eventId })
    .from(registrations)
    .where(
      and(
        or(eq(registrations.userId, userId), eq(registrations.email, email)),
        inArray(registrations.status, ["going", "pending", "waitlist"]),
      ),
    );
  const ids = regRows.map((r) => r.eventId);
  if (ids.length === 0) return [];

  return baseEventQuery()
    .where(
      and(
        inArray(events.id, ids),
        when === "upcoming" ? gte(events.startAt, now) : lt(events.startAt, now),
      ),
    )
    .orderBy(when === "past" ? desc(events.startAt) : asc(events.startAt));
}

/** Full event detail with host, co-hosts, tickets, calendar, and going list. */
export async function getEventBySlug(slug: string) {
  const row = await db
    .select({ event: events, host: users, calendar: calendars })
    .from(events)
    .innerJoin(users, eq(users.id, events.hostId))
    .leftJoin(calendars, eq(calendars.id, events.calendarId))
    .where(eq(events.slug, slug))
    .get();

  if (!row) return null;
  const eventId = row.event.id;

  const [ticketRows, going, hostRows, attendees] = await Promise.all([
    db
      .select()
      .from(tickets)
      .where(eq(tickets.eventId, eventId))
      .orderBy(asc(tickets.sortOrder)),
    db
      .select({ c: count() })
      .from(registrations)
      .where(
        and(
          eq(registrations.eventId, eventId),
          eq(registrations.status, "going"),
        ),
      )
      .get(),
    db
      .select({ user: users, role: eventHosts.role })
      .from(eventHosts)
      .innerJoin(users, eq(users.id, eventHosts.userId))
      .where(and(eq(eventHosts.eventId, eventId), ne(eventHosts.userId, row.event.hostId))),
    db
      .select({ name: registrations.name })
      .from(registrations)
      .where(
        and(
          eq(registrations.eventId, eventId),
          eq(registrations.status, "going"),
        ),
      )
      .orderBy(desc(registrations.createdAt))
      .limit(12),
  ]);

  return {
    ...row.event,
    host: row.host,
    calendar: row.calendar,
    tickets: ticketRows,
    cohosts: hostRows.map((h) => h.user),
    goingCount: going?.c ?? 0,
    attendeeNames: attendees.map((a) => a.name),
  };
}

export type EventDetail = NonNullable<Awaited<ReturnType<typeof getEventBySlug>>>;

/** Has this email already registered for this event? */
export async function findRegistration(eventId: string, email: string) {
  return db
    .select()
    .from(registrations)
    .where(
      and(
        eq(registrations.eventId, eventId),
        eq(registrations.email, email.trim().toLowerCase()),
      ),
    )
    .get();
}
