"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock } from "@/components/clock";
import { Logo } from "@/components/logo";
import { UserMenu } from "@/components/user-menu";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type NavUser = { id: string; name: string; email: string; avatarUrl: string | null };

export function NavBar({
  user,
  lumaConnected = false,
}: {
  user: NavUser | null;
  lumaConnected?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const navLink = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          "text-sm transition-colors hover:text-ink",
          active ? "text-ink font-medium" : "text-ink-secondary",
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-shadow",
        scrolled ? "glass border-b border-line" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Logo href={user ? "/home" : "/"} />

        <div className="ml-auto hidden items-center gap-6 md:flex">
          <Clock className="text-[13px] tabular-nums text-ink-tertiary" />
          {lumaConnected && navLink("/calendar", "My Calendar")}
          {navLink("/discover", "Explore Events")}
          {user ? (
            <>
              <ButtonLink href="/create" size="sm" variant="secondary">
                Create Event
              </ButtonLink>
              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm text-ink-secondary transition-colors hover:text-ink"
              >
                Sign In
              </Link>
              <ButtonLink href="/create" size="sm">
                Create Event
              </ButtonLink>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="ml-auto flex items-center gap-3 md:hidden">
          <Clock className="text-[13px] tabular-nums text-ink-tertiary" />
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-black/5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-line glass px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {lumaConnected && (
              <Link href="/calendar" className="py-1 text-ink-secondary">My Calendar</Link>
            )}
            <Link href="/discover" className="py-1 text-ink-secondary">Explore Events</Link>
            <Link href="/create" className="py-1 text-ink-secondary">Create Event</Link>
            {user ? (
              <Link href="/home" className="py-1 text-ink-secondary">My Events</Link>
            ) : (
              <Link href="/signin" className="py-1 text-ink-secondary">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
