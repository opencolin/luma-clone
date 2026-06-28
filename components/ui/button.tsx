import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "brand" | "secondary" | "ghost" | "white";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-[10px] transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink/30";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white shadow-[0_1px_2px_rgba(19,21,23,0.2)] hover:bg-[#2b2e33]",
  brand: "bg-brand text-white shadow-[0_1px_2px_rgba(229,72,77,0.3)] hover:bg-brand-hover",
  secondary:
    "bg-surface text-ink border border-line-strong hover:bg-surface-2",
  ghost: "text-ink hover:bg-black/5",
  white: "bg-white text-ink shadow-card hover:bg-white/90",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export function buttonClasses(opts?: {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const { variant = "primary", size = "md", className } = opts ?? {};
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses({ variant, size, className })} {...props} />
  );
}

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  ...props
}: ButtonLinkProps) {
  const cls = buttonClasses({ variant, size, className });
  if (href.startsWith("http") || href.startsWith("#")) {
    return <a href={href} className={cls} {...props} />;
  }
  return <Link href={href} className={cls} {...props} />;
}
