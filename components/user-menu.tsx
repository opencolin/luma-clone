"use client";

import { CalendarPlus, LayoutGrid, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/actions/auth";
import { Avatar } from "@/components/ui/avatar";
import type { NavUser } from "@/components/nav-bar";

export function UserMenu({ user }: { user: NavUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center rounded-full ring-offset-2 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        aria-label="Account menu"
      >
        <Avatar name={user.name} src={user.avatarUrl} size={32} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-60 overflow-hidden rounded-xl border border-line bg-surface shadow-pop animate-in">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-[13px] text-ink-tertiary">{user.email}</p>
          </div>
          <div className="p-1.5">
            <MenuLink href="/home" icon={LayoutGrid}>
              My Events
            </MenuLink>
            <MenuLink href="/create" icon={CalendarPlus}>
              Create Event
            </MenuLink>
          </div>
          <div className="border-t border-line p-1.5">
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-ink-secondary transition-colors hover:bg-black/5 hover:text-ink"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-secondary transition-colors hover:bg-black/5 hover:text-ink"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
