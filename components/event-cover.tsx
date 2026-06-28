import { cn } from "@/lib/utils";

/** 3-stop gradient palette keyed by theme color. */
export const THEME_STOPS: Record<string, [string, string, string]> = {
  rose: ["#ff8fb1", "#f43f8e", "#a21caf"],
  orange: ["#ffc176", "#f5821f", "#e5484d"],
  amber: ["#ffe07a", "#f5a623", "#f5821f"],
  green: ["#86efac", "#2bab6d", "#0f766e"],
  teal: ["#7ff0e0", "#14b8a6", "#2f7fed"],
  blue: ["#8ec5ff", "#2f7fed", "#6366f1"],
  indigo: ["#a5b4fc", "#6366f1", "#9b5de5"],
  purple: ["#d8b4fe", "#9b5de5", "#f43f8e"],
};

function PatternOverlay({
  pattern,
  c,
}: {
  pattern: string;
  c: [string, string, string];
}) {
  switch (pattern) {
    case "rings":
      return (
        <svg
          className="absolute inset-0 h-full w-full opacity-50 mix-blend-soft-light"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {[10, 22, 34, 46, 58].map((r) => (
            <circle
              key={r}
              cx="78"
              cy="26"
              r={r}
              fill="none"
              stroke="white"
              strokeWidth="0.6"
            />
          ))}
        </svg>
      );
    case "grid":
      return (
        <svg
          className="absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="dotgrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.2" cy="1.2" r="1.2" fill="white" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#dotgrid)" />
        </svg>
      );
    case "confetti":
      return (
        <svg
          className="absolute inset-0 h-full w-full opacity-70 mix-blend-overlay"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {Array.from({ length: 26 }).map((_, i) => {
            const x = (i * 37) % 100;
            const y = (i * 53) % 100;
            const rot = (i * 47) % 360;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="3.4"
                height="3.4"
                rx="1"
                fill="white"
                transform={`rotate(${rot} ${x} ${y})`}
              />
            );
          })}
        </svg>
      );
    case "mesh":
      return (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(at 18% 22%, ${c[0]} 0px, transparent 55%), radial-gradient(at 82% 18%, ${c[2]} 0px, transparent 50%), radial-gradient(at 70% 88%, ${c[1]} 0px, transparent 55%)`,
          }}
        />
      );
    case "aurora":
    default:
      return (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(120% 80% at 0% 0%, ${c[0]}cc 0%, transparent 45%), radial-gradient(120% 90% at 100% 30%, ${c[2]}aa 0%, transparent 50%), radial-gradient(100% 120% at 60% 100%, ${c[1]}cc 0%, transparent 55%)`,
          }}
        />
      );
  }
}

/**
 * Renders an event's cover. Uses the uploaded image when present, otherwise
 * generates a gradient + pattern cover (like Luma's built-in pattern covers).
 */
export function EventCover({
  coverUrl,
  theme = "indigo",
  pattern = "aurora",
  title,
  className,
  showTitle = false,
  rounded = "rounded-2xl",
}: {
  coverUrl?: string | null;
  theme?: string;
  pattern?: string;
  title?: string;
  className?: string;
  showTitle?: boolean;
  rounded?: string;
}) {
  const c = THEME_STOPS[theme] ?? THEME_STOPS.indigo;

  if (coverUrl) {
    return (
      <div className={cn("relative overflow-hidden", rounded, className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={title ?? "Event cover"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", rounded, className)}
      style={{
        background: `linear-gradient(135deg, ${c[0]} 0%, ${c[1]} 50%, ${c[2]} 100%)`,
      }}
    >
      <PatternOverlay pattern={pattern} c={c} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10" />
      {showTitle && title ? (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <span
            className="text-center font-semibold text-white drop-shadow-sm"
            style={{
              fontSize: "clamp(1.25rem, 3.4vw, 2.4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </span>
        </div>
      ) : null}
    </div>
  );
}
