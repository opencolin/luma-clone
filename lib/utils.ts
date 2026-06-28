import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Initials for avatar fallbacks: "Ada Lovelace" -> "AL" */
export function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

/** Deterministic accent color key from an arbitrary string (avatars, etc). */
const ACCENTS = [
  "rose",
  "orange",
  "amber",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
] as const;
export type Accent = (typeof ACCENTS)[number];

export function accentFrom(seed: string): Accent {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

export function formatPrice(price: number, currency = "USD") {
  if (price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}

/** Slug for calendars / vanity URLs. */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export const CSS_FOR_ACCENT: Record<Accent, { bg: string; fg: string }> = {
  rose: { bg: "var(--color-rose)", fg: "#fff" },
  orange: { bg: "var(--color-orange)", fg: "#fff" },
  amber: { bg: "var(--color-amber)", fg: "#fff" },
  green: { bg: "var(--color-green)", fg: "#fff" },
  teal: { bg: "var(--color-teal)", fg: "#fff" },
  blue: { bg: "var(--color-blue)", fg: "#fff" },
  indigo: { bg: "var(--color-indigo)", fg: "#fff" },
  purple: { bg: "var(--color-purple)", fg: "#fff" },
};
