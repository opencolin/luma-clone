import { MapPin, Navigation } from "lucide-react";

/** A tasteful faux-map block + a real "Get Directions" link (no API key). */
export function MapBlock({
  name,
  address,
}: {
  name?: string | null;
  address?: string | null;
}) {
  const query = encodeURIComponent([name, address].filter(Boolean).join(", "));
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${query}`}
        target="_blank"
        rel="noreferrer"
        className="relative block h-40 w-full"
        aria-label="Open in Google Maps"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 400 160"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="400" height="160" fill="#eef1f4" />
          {/* faux blocks */}
          <g fill="#e2e7ec">
            <rect x="20" y="14" width="90" height="54" rx="4" />
            <rect x="130" y="10" width="120" height="40" rx="4" />
            <rect x="270" y="20" width="110" height="60" rx="4" />
            <rect x="30" y="92" width="120" height="56" rx="4" />
            <rect x="170" y="86" width="90" height="64" rx="4" />
            <rect x="280" y="100" width="100" height="50" rx="4" />
          </g>
          {/* roads */}
          <g stroke="#fff" strokeWidth="6" strokeLinecap="round">
            <line x1="0" y1="78" x2="400" y2="74" />
            <line x1="120" y1="0" x2="128" y2="160" />
            <line x1="262" y1="0" x2="268" y2="160" />
          </g>
        </svg>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow-pop">
            <MapPin className="h-4 w-4" fill="currentColor" />
          </span>
        </span>
      </a>
      <div className="flex items-center justify-between gap-3 bg-surface p-3.5">
        <div className="min-w-0">
          {name && (
            <p className="truncate text-sm font-medium text-ink">{name}</p>
          )}
          {address && (
            <p className="truncate text-[13px] text-ink-tertiary">{address}</p>
          )}
        </div>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${query}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line-strong px-2.5 py-1.5 text-[13px] font-medium text-ink hover:bg-surface-2"
        >
          <Navigation className="h-3.5 w-3.5" />
          Directions
        </a>
      </div>
    </div>
  );
}
