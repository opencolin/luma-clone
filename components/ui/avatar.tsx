import { accentFrom, cn, initials } from "@/lib/utils";

const GRADIENTS: Record<string, string> = {
  rose: "linear-gradient(135deg,#ff6b9d,#c026d3)",
  orange: "linear-gradient(135deg,#ffb347,#e5484d)",
  amber: "linear-gradient(135deg,#ffd34e,#f5821f)",
  green: "linear-gradient(135deg,#5be584,#0f766e)",
  teal: "linear-gradient(135deg,#5eead4,#2f7fed)",
  blue: "linear-gradient(135deg,#60a5fa,#6366f1)",
  indigo: "linear-gradient(135deg,#818cf8,#9b5de5)",
  purple: "linear-gradient(135deg,#c084fc,#f43f8e)",
};

export function Avatar({
  name,
  src,
  size = 36,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const accent = accentFrom(name);
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full text-white font-medium ring-1 ring-black/5",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: GRADIENTS[accent],
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="leading-none">{initials(name)}</span>
      )}
    </span>
  );
}

export function AvatarStack({
  names,
  size = 28,
  max = 5,
}: {
  names: string[];
  size?: number;
  max?: number;
}) {
  const shown = names.slice(0, max);
  return (
    <div className="flex items-center">
      {shown.map((n, i) => (
        <div
          key={i}
          style={{ marginLeft: i === 0 ? 0 : -size * 0.32, zIndex: max - i }}
          className="ring-2 ring-bg rounded-full"
        >
          <Avatar name={n} size={size} />
        </div>
      ))}
    </div>
  );
}
