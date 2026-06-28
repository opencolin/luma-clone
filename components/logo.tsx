import Link from "next/link";
import { cn } from "@/lib/utils";

/** The gradient square mark, usable on its own (favicon, avatars). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[28%] text-white",
        className,
      )}
      style={{
        background:
          "linear-gradient(140deg, #ff7a59 0%, #e5484d 50%, #f43f8e 100%)",
      }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-[58%] w-[58%]">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="12" cy="12" r="2.6" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 group", className)}
    >
      <LogoMark className="h-7 w-7 transition-transform group-hover:scale-105" />
      <span className="text-[19px] font-semibold tracking-tight text-ink">
        luma
      </span>
    </Link>
  );
}
