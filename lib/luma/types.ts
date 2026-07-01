// Subset of the Luma public API shapes we consume.
// Docs: https://docs.lu.ma

export type LumaGeoAddress = {
  address?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  city_state?: string | null;
  full_address?: string | null;
  google_maps_place_id?: string | null;
  description?: string | null;
};

export type LumaEvent = {
  api_id: string;
  calendar_api_id?: string;
  name: string;
  description?: string | null;
  description_md?: string | null;
  cover_url?: string | null;
  start_at: string; // ISO
  end_at?: string | null; // ISO
  duration_interval?: string | null;
  url?: string | null; // e.g. https://luma.com/<slug>
  timezone?: string | null;
  visibility?: string | null; // "public" | "unlisted"
  location_type?: string | null; // "offline" | "online"
  geo_address_json?: LumaGeoAddress | null;
  meeting_url?: string | null;
  zoom_meeting_url?: string | null;
  tags?: { name?: string; api_id?: string }[];
};

export type LumaEventEntry = { event?: LumaEvent } & LumaEvent;

export type LumaListEventsResponse = {
  entries: LumaEventEntry[];
  has_more?: boolean;
  next_cursor?: string | null;
};

export type LumaHost = {
  name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  api_id?: string | null;
};

export type LumaEventDetail = {
  event: LumaEvent;
  hosts?: LumaHost[];
};

export type LumaCalendar = {
  api_id?: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  avatar_url?: string | null;
  cover_image_url?: string | null;
  website?: string | null;
  twitter_handle?: string | null;
  instagram_handle?: string | null;
};

export type LumaGuest = {
  api_id: string;
  approval_status?: string | null; // "approved" | "pending_approval" | "declined"
  registered_at?: string | null;
  checked_in_at?: string | null;
  name?: string | null;
  email?: string | null;
  user_name?: string | null;
  user_first_name?: string | null;
  avatar_url?: string | null;
};

export type LumaGuestEntry = LumaGuest & { guest?: LumaGuest };

export type LumaGuestsResponse = {
  entries: LumaGuestEntry[];
  has_more?: boolean;
  next_cursor?: string | null;
};
