import { sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(12));

const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date());

/* ----------------------------- Users ----------------------------- */
export const users = sqliteTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: createdAt(),
});

/* ---------------------------- Sessions ---------------------------- */
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // opaque session token
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: createdAt(),
});

/* --------------------------- Calendars ---------------------------- */
// A calendar is a host page that groups events (e.g. "Cursor Community").
export const calendars = sqliteTable("calendars", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  avatarUrl: text("avatar_url"),
  coverUrl: text("cover_url"),
  color: text("color").notNull().default("indigo"),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: createdAt(),
});

export const calendarSubscriptions = sqliteTable(
  "calendar_subscriptions",
  {
    calendarId: text("calendar_id")
      .notNull()
      .references(() => calendars.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.calendarId, t.userId] })],
);

/* ----------------------------- Events ----------------------------- */
export const events = sqliteTable("events", {
  id: id(),
  // Short public URL slug, e.g. lu.ma/a1b2c3d4
  slug: text("slug")
    .notNull()
    .unique()
    .$defaultFn(() => nanoid(8)),
  title: text("title").notNull(),
  description: text("description").default(""),
  coverUrl: text("cover_url"),
  // Theme color key used to tint the event page (matches accent palette)
  themeColor: text("theme_color").notNull().default("indigo"),
  // Visual style of the auto-generated cover when no image is set
  coverPattern: text("cover_pattern").notNull().default("aurora"),

  startAt: integer("start_at", { mode: "timestamp" }).notNull(),
  endAt: integer("end_at", { mode: "timestamp" }),
  timezone: text("timezone").notNull().default("America/Los_Angeles"),

  // location: "physical" | "online" | "tbd"
  locationType: text("location_type").notNull().default("physical"),
  locationName: text("location_name"),
  locationAddress: text("location_address"),
  locationUrl: text("location_url"),
  // Reveal exact address only after registering
  hideAddress: integer("hide_address", { mode: "boolean" })
    .notNull()
    .default(false),

  // visibility: "public" | "unlisted"
  visibility: text("visibility").notNull().default("public"),
  category: text("category"),
  capacity: integer("capacity"),
  requiresApproval: integer("requires_approval", { mode: "boolean" })
    .notNull()
    .default(false),

  hostId: text("host_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  calendarId: text("calendar_id").references(() => calendars.id, {
    onDelete: "set null",
  }),

  createdAt: createdAt(),
});

/* ----------------------------- Tickets ---------------------------- */
export const tickets = sqliteTable("tickets", {
  id: id(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  name: text("name").notNull().default("Standard"),
  description: text("description"),
  // price in major currency units (e.g. dollars). 0 == free.
  price: real("price").notNull().default(0),
  currency: text("currency").notNull().default("USD"),
  capacity: integer("capacity"),
  sortOrder: integer("sort_order").notNull().default(0),
});

/* -------------------------- Registrations ------------------------- */
// status: "going" | "pending" | "waitlist" | "declined"
export const registrations = sqliteTable("registrations", {
  id: id(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  ticketId: text("ticket_id").references(() => tickets.id, {
    onDelete: "set null",
  }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  guestCount: integer("guest_count").notNull().default(0),
  status: text("status").notNull().default("going"),
  createdAt: createdAt(),
});

/* ----------------------- Event co-hosts (M:N) --------------------- */
export const eventHosts = sqliteTable(
  "event_hosts",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // role: "host" | "cohost"
    role: text("role").notNull().default("cohost"),
  },
  (t) => [primaryKey({ columns: [t.eventId, t.userId] })],
);

export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Ticket = typeof tickets.$inferSelect;
export type Registration = typeof registrations.$inferSelect;
export type Calendar = typeof calendars.$inferSelect;
