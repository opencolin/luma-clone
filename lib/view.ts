/**
 * Normalized shape consumed by <EventCard />. Both local DB rows (EventListItem)
 * and mapped Luma API events conform to this, so one card renders both sources.
 */
export type CardRow = {
  event: {
    slug: string; // used to build the href: `/${slug}`
    title: string;
    coverUrl: string | null;
    themeColor: string;
    coverPattern: string;
    startAt: Date;
    endAt: Date | null;
    timezone: string;
    locationType: string;
    locationName: string | null;
  };
  host: { name: string; avatarUrl: string | null };
  calendar: { name: string } | null;
  going: number;
  /** Marks Luma-sourced rows for optional "live" badges. */
  source?: "local" | "luma";
};
