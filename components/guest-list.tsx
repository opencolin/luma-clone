"use client";

import { Check, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { setRegistrationStatus } from "@/app/actions/manage";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type ManageGuest = {
  id: string;
  name: string;
  email: string;
  status: string;
  guestCount: number;
  ticketName: string | null;
  registeredLabel: string;
};

const STATUS_STYLE: Record<string, string> = {
  going: "bg-green/10 text-green",
  pending: "bg-amber/10 text-amber",
  waitlist: "bg-blue/10 text-blue",
  declined: "bg-ink/5 text-ink-tertiary",
};

const FILTERS = ["all", "going", "pending", "waitlist", "declined"] as const;

export function GuestList({
  guests,
  requiresApproval,
}: {
  guests: ManageGuest[];
  requiresApproval: boolean;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: guests.length };
    for (const g of guests) c[g.status] = (c[g.status] ?? 0) + 1;
    return c;
  }, [guests]);

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return guests.filter(
      (g) =>
        (filter === "all" || g.status === filter) &&
        (!term ||
          g.name.toLowerCase().includes(term) ||
          g.email.toLowerCase().includes(term)),
    );
  }, [guests, filter, q]);

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.filter((f) => f !== "waitlist" || counts.waitlist)
            .filter((f) => f !== "declined" || counts.declined)
            .filter((f) => f !== "pending" || requiresApproval || counts.pending)
            .map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[13px] font-medium capitalize transition-colors",
                  filter === f
                    ? "bg-ink text-white"
                    : "text-ink-secondary hover:bg-black/5",
                )}
              >
                {f} {counts[f] ? `· ${counts[f]}` : ""}
              </button>
            ))}
        </div>
        <div className="relative sm:ml-auto sm:w-56">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-tertiary" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search guests"
            className="h-8 w-full rounded-lg border border-line bg-surface pl-8 pr-3 text-[13px] outline-none focus:border-ink/40"
          />
        </div>
      </div>

      {/* Rows */}
      {shown.length === 0 ? (
        <p className="p-10 text-center text-sm text-ink-tertiary">
          No {filter === "all" ? "" : filter} guests{q ? " match your search" : ""}.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {shown.map((g) => (
            <li key={g.id} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={g.name} size={36} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {g.name}
                  {g.guestCount > 0 && (
                    <span className="ml-1 text-ink-tertiary">+{g.guestCount}</span>
                  )}
                </p>
                <p className="truncate text-[13px] text-ink-tertiary">{g.email}</p>
              </div>
              <div className="hidden text-right text-[12px] text-ink-tertiary sm:block">
                {g.ticketName && <p>{g.ticketName}</p>}
                <p>{g.registeredLabel}</p>
              </div>

              {g.status === "pending" ? (
                <div className="flex gap-1.5">
                  <StatusForm id={g.id} status="going" variant="approve" />
                  <StatusForm id={g.id} status="declined" variant="decline" />
                </div>
              ) : (
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium capitalize",
                    STATUS_STYLE[g.status] ?? STATUS_STYLE.declined,
                  )}
                >
                  {g.status}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StatusForm({
  id,
  status,
  variant,
}: {
  id: string;
  status: string;
  variant: "approve" | "decline";
}) {
  return (
    <form action={setRegistrationStatus}>
      <input type="hidden" name="registrationId" value={id} />
      <input type="hidden" name="status" value={status} />
      <IconSubmit variant={variant} />
    </form>
  );
}

function IconSubmit({ variant }: { variant: "approve" | "decline" }) {
  const { pending } = useFormStatus();
  const approve = variant === "approve";
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={approve ? "Approve" : "Decline"}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-50",
        approve
          ? "border-green/30 bg-green/10 text-green hover:bg-green/20"
          : "border-line text-ink-tertiary hover:bg-black/5",
      )}
    >
      {approve ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
    </button>
  );
}
