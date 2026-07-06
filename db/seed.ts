import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { nanoid } from "nanoid";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "file:./luma.db";
const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
const db = drizzle(client, { schema });

const DAY = 86_400_000;
const HOUR = 3_600_000;
// Anchor to the moment of seeding so demo events are always current.
const NOW = Date.now();
const at = (days: number, hour = 18) =>
  new Date(NOW + days * DAY - (new Date(NOW).getHours() - hour) * HOUR);

async function main() {
  console.log("→ Seeding Luma demo data…");

  // Idempotent reset
  await db.delete(schema.registrations);
  await db.delete(schema.eventHosts);
  await db.delete(schema.tickets);
  await db.delete(schema.events);
  await db.delete(schema.calendarSubscriptions);
  await db.delete(schema.calendars);
  await db.delete(schema.sessions);
  await db.delete(schema.users);

  /* --------------------------- Users --------------------------- */
  const usersData = [
    { name: "Ada Chen", email: "ada@luma.dev", bio: "Building communities in SF." },
    { name: "Marco Reyes", email: "marco@luma.dev", bio: "Designer & event host." },
    { name: "Priya Nair", email: "priya@luma.dev", bio: "Climate tech organizer." },
    { name: "Jordan Blake", email: "jordan@luma.dev", bio: "DJ and night owl." },
    { name: "Sora Tanaka", email: "sora@luma.dev", bio: "Runs the design guild." },
    { name: "You", email: "you@example.com", bio: "Welcome to your Luma clone." },
  ];
  const users = await db
    .insert(schema.users)
    .values(
      usersData.map((u) => ({
        ...u,
        avatarUrl: null,
      })),
    )
    .returning();
  const byEmail = (e: string) => users.find((u) => u.email === e)!;

  /* ------------------------- Calendars ------------------------- */
  const calendars = await db
    .insert(schema.calendars)
    .values([
      {
        slug: "sf-tech",
        name: "SF Tech Week",
        description:
          "The best technology meetups, talks and hack nights across San Francisco.",
        color: "blue",
        ownerId: byEmail("ada@luma.dev").id,
      },
      {
        slug: "design-guild",
        name: "Design Guild",
        description: "Portfolio reviews, critiques and design jams.",
        color: "purple",
        ownerId: byEmail("sora@luma.dev").id,
      },
      {
        slug: "climate-collective",
        name: "Climate Collective",
        description: "Founders and builders working on the climate.",
        color: "green",
        ownerId: byEmail("priya@luma.dev").id,
      },
    ])
    .returning();
  const cal = (slug: string) => calendars.find((c) => c.slug === slug)!;

  /* --------------------------- Events -------------------------- */
  type Seed = {
    title: string;
    description: string;
    days: number;
    hour?: number;
    durationH?: number;
    theme: string;
    pattern: string;
    category: string;
    locationName: string;
    locationAddress: string;
    locationType?: string;
    host: string;
    calendar?: string;
    capacity?: number;
    requiresApproval?: boolean;
    tickets?: { name: string; price: number; description?: string }[];
  };

  const seeds: Seed[] = [
    {
      title: "Cafe Cursor San Francisco",
      description:
        "Join us at Cafe Cursor!\n\nWe're taking over a cafe in North Beach and inviting Cursor users to come hang. Bring your laptop and we'll spend some time building with other Cursor users — free coffee and pastries on us.\n\nDrop by anytime between 10am and 8pm. Come for an hour, come for the whole day.",
      days: 1,
      hour: 10,
      durationH: 10,
      theme: "orange",
      pattern: "aurora",
      category: "Tech",
      locationName: "North Beach Cafe",
      locationAddress: "1600 Stockton St, San Francisco, CA",
      host: "ada@luma.dev",
      calendar: "sf-tech",
      tickets: [
        { name: "General Admission", price: 0, description: "Drop in any time." },
        { name: "Builder (limited)", price: 0, description: "Reserved desk + power for the day." },
      ],
    },
    {
      title: "Friday Night Rooftop Sessions",
      description:
        "Sunset, good people and a curated house set as the city lights come on. Limited capacity — grab a spot early.",
      days: 3,
      hour: 19,
      durationH: 5,
      theme: "rose",
      pattern: "mesh",
      category: "Music",
      locationName: "The Pearl Rooftop",
      locationAddress: "601 19th St, San Francisco, CA",
      host: "jordan@luma.dev",
      capacity: 120,
      tickets: [
        { name: "Early Bird", price: 15 },
        { name: "Door", price: 25 },
      ],
    },
    {
      title: "Design Portfolio Review Night",
      description:
        "Bring your portfolio (or a single project) and get live feedback from senior designers. Small groups, friendly critique, lots of sticky notes.",
      days: 5,
      hour: 18,
      durationH: 3,
      theme: "purple",
      pattern: "rings",
      category: "Design",
      locationName: "Figma HQ",
      locationAddress: "760 Market St, San Francisco, CA",
      host: "sora@luma.dev",
      calendar: "design-guild",
      capacity: 60,
      requiresApproval: true,
      tickets: [{ name: "Reviewee", price: 0 }, { name: "Observer", price: 0 }],
    },
    {
      title: "Climate Builders Breakfast",
      description:
        "Founders working on climate tech meet over coffee and pastries. Short intros, then open conversation. No pitches, just builders.",
      days: 8,
      hour: 8,
      durationH: 2,
      theme: "green",
      pattern: "grid",
      category: "Climate",
      locationName: "Sightglass Coffee",
      locationAddress: "270 7th St, San Francisco, CA",
      host: "priya@luma.dev",
      calendar: "climate-collective",
      tickets: [{ name: "Free", price: 0 }],
    },
    {
      title: "Intro to Local-First Apps",
      description:
        "A hands-on workshop on building apps that work offline and sync seamlessly. Bring a laptop. We'll build a tiny app together with SQLite + sync.",
      days: 10,
      hour: 17,
      durationH: 3,
      theme: "teal",
      pattern: "aurora",
      category: "Tech",
      locationName: "Online",
      locationAddress: "",
      locationType: "online",
      host: "ada@luma.dev",
      calendar: "sf-tech",
      tickets: [{ name: "Free", price: 0 }],
    },
    {
      title: "Long Table Supper Club",
      description:
        "One long table, twelve strangers, four courses. A slow dinner designed for real conversation. Dietary needs? Let us know after you register.",
      days: 14,
      hour: 19,
      durationH: 4,
      theme: "amber",
      pattern: "confetti",
      category: "Food & Drink",
      locationName: "A private loft",
      locationAddress: "Mission District, San Francisco, CA",
      host: "marco@luma.dev",
      capacity: 12,
      requiresApproval: true,
      tickets: [{ name: "Seat at the table", price: 65 }],
    },
    {
      title: "Morning Run Club: Embarcadero",
      description:
        "A relaxed 5k along the water to start your weekend. All paces welcome. We grab coffee after.",
      days: 6,
      hour: 8,
      durationH: 1,
      theme: "blue",
      pattern: "mesh",
      category: "Fitness",
      locationName: "Ferry Building",
      locationAddress: "1 Ferry Building, San Francisco, CA",
      host: "priya@luma.dev",
      tickets: [{ name: "Free", price: 0 }],
    },
    {
      title: "AI Hack Night #12",
      description:
        "Build something with AI in three hours and demo it. Prizes, pizza, and a very supportive crowd. Solo or teams welcome.",
      days: 12,
      hour: 18,
      durationH: 4,
      theme: "indigo",
      pattern: "rings",
      category: "Tech",
      locationName: "GitHub HQ",
      locationAddress: "88 Colin P Kelly Jr St, San Francisco, CA",
      host: "ada@luma.dev",
      calendar: "sf-tech",
      capacity: 200,
      tickets: [
        { name: "Hacker", price: 0 },
        { name: "Mentor", price: 0 },
      ],
    },
    {
      title: "Vinyl & Natural Wine",
      description:
        "We spin records, you sip natural wine. A cozy evening of analog sound and good company.",
      days: 19,
      hour: 20,
      durationH: 4,
      theme: "rose",
      pattern: "aurora",
      category: "Music",
      locationName: "Bar Part Time",
      locationAddress: "496 14th St, San Francisco, CA",
      host: "jordan@luma.dev",
      tickets: [{ name: "Entry", price: 10 }],
    },
    {
      title: "Founders & Coffee (Past)",
      description:
        "Our monthly founders meetup. This one already happened — thanks to everyone who came!",
      days: -5,
      hour: 9,
      durationH: 2,
      theme: "green",
      pattern: "grid",
      category: "Tech",
      locationName: "Réveille Coffee",
      locationAddress: "200 Columbus Ave, San Francisco, CA",
      host: "priya@luma.dev",
      calendar: "climate-collective",
      tickets: [{ name: "Free", price: 0 }],
    },
  ];

  for (const s of seeds) {
    const start = at(s.days, s.hour ?? 18);
    const [event] = await db
      .insert(schema.events)
      .values({
        slug: nanoid(8),
        title: s.title,
        description: s.description,
        themeColor: s.theme,
        coverPattern: s.pattern,
        category: s.category,
        startAt: start,
        endAt: new Date(start.getTime() + (s.durationH ?? 2) * HOUR),
        locationType: s.locationType ?? "physical",
        locationName: s.locationName,
        locationAddress: s.locationAddress,
        hideAddress: s.requiresApproval ?? false,
        capacity: s.capacity ?? null,
        requiresApproval: s.requiresApproval ?? false,
        hostId: byEmail(s.host).id,
        calendarId: s.calendar ? cal(s.calendar).id : null,
      })
      .returning();

    const ticketRows = (s.tickets ?? [{ name: "Free", price: 0 }]).map(
      (t, i) => ({
        eventId: event.id,
        name: t.name,
        price: t.price,
        description: t.description ?? null,
        sortOrder: i,
      }),
    );
    const insertedTickets = await db
      .insert(schema.tickets)
      .values(ticketRows)
      .returning();

    await db.insert(schema.eventHosts).values({
      eventId: event.id,
      userId: byEmail(s.host).id,
      role: "host",
    });

    // Sprinkle in some attendees so guest counts look alive.
    const goingCount = Math.min(
      s.capacity ?? 40,
      6 + Math.floor((s.title.length * 7) % 38),
    );
    const regs = Array.from({ length: goingCount }, (_, i) => ({
      eventId: event.id,
      ticketId: insertedTickets[0].id,
      userId: null,
      name: `Guest ${i + 1}`,
      email: `guest${i + 1}.${nanoid(4)}@example.com`,
      status: s.days < 0 ? "going" : "going",
    }));
    if (regs.length) await db.insert(schema.registrations).values(regs);
  }

  const counts = {
    users: users.length,
    calendars: calendars.length,
    events: seeds.length,
  };
  console.log(`✓ Seeded ${counts.events} events, ${counts.calendars} calendars, ${counts.users} users`);
  client.close();
}

main().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
