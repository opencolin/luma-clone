"use client";

import { Check, Clock3, Loader2, Ticket as TicketIcon } from "lucide-react";
import { useActionState, useState } from "react";
import {
  registerForEvent,
  type RegisterState,
} from "@/app/actions/registration";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import type { Ticket } from "@/db/schema";

type Props = {
  eventId: string;
  tickets: Ticket[];
  requiresApproval: boolean;
  isFull: boolean;
  isPast: boolean;
  initialStatus?: "going" | "pending" | "waitlist" | null;
  prefill?: { name: string; email: string };
};

const initial: RegisterState = { ok: false };

export function RegistrationForm({
  eventId,
  tickets,
  requiresApproval,
  isFull,
  isPast,
  initialStatus,
  prefill,
}: Props) {
  const [state, action, pending] = useActionState(registerForEvent, initial);
  const [expanded, setExpanded] = useState(false);
  const [ticketId, setTicketId] = useState(tickets[0]?.id);

  const status = state.ok ? state.status : initialStatus;

  if (status) {
    return <Confirmed status={status} />;
  }

  if (isPast) {
    return (
      <div className="rounded-xl bg-surface-2 p-4 text-center text-sm text-ink-secondary">
        This event has ended.
      </div>
    );
  }

  const selected = tickets.find((t) => t.id === ticketId) ?? tickets[0];
  const cta = requiresApproval
    ? "Request to Join"
    : isFull
      ? "Join Waitlist"
      : selected && selected.price > 0
        ? `Get Ticket · ${formatPrice(selected.price, selected.currency)}`
        : "One-Click Register";

  return (
    <div className="space-y-4">
      {tickets.length > 1 && (
        <fieldset className="space-y-2">
          <legend className="mb-1 text-[13px] font-medium text-ink-secondary">
            Select a ticket
          </legend>
          {tickets.map((t) => (
            <label
              key={t.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors",
                ticketId === t.id
                  ? "border-ink bg-surface-2"
                  : "border-line hover:border-line-strong",
              )}
            >
              <input
                type="radio"
                name="ticketPick"
                value={t.id}
                checked={ticketId === t.id}
                onChange={() => setTicketId(t.id)}
                className="sr-only"
              />
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border",
                  ticketId === t.id ? "border-ink" : "border-line-strong",
                )}
              >
                {ticketId === t.id && (
                  <span className="h-2 w-2 rounded-full bg-ink" />
                )}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-ink">
                  {t.name}
                </span>
                {t.description && (
                  <span className="block text-[13px] text-ink-tertiary">
                    {t.description}
                  </span>
                )}
              </span>
              <span className="text-sm font-medium text-ink">
                {formatPrice(t.price, t.currency)}
              </span>
            </label>
          ))}
        </fieldset>
      )}

      {!expanded ? (
        <Button
          className="w-full"
          size="lg"
          variant={requiresApproval || isFull ? "secondary" : "primary"}
          onClick={() => setExpanded(true)}
        >
          {cta}
        </Button>
      ) : (
        <form action={action} className="space-y-3">
          <input type="hidden" name="eventId" value={eventId} />
          <input type="hidden" name="ticketId" value={ticketId ?? ""} />
          <Field
            label="Your name"
            name="name"
            placeholder="Ada Lovelace"
            defaultValue={prefill?.name}
            autoFocus={!prefill?.name}
          />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            defaultValue={prefill?.email}
          />
          {state.error && (
            <p className="text-[13px] text-brand">{state.error}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            variant={requiresApproval || isFull ? "secondary" : "primary"}
            disabled={pending}
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin-slow" />
            ) : (
              cta
            )}
          </Button>
          <p className="text-center text-[12px] text-ink-tertiary">
            By registering you agree to the host&apos;s terms.
          </p>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-medium text-ink-secondary">
        {label}
      </span>
      <input
        {...props}
        required
        className="h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-tertiary focus:border-ink/40 focus:ring-4 focus:ring-ink/5"
      />
    </label>
  );
}

function Confirmed({ status }: { status: "going" | "pending" | "waitlist" }) {
  const map = {
    going: {
      icon: Check,
      title: "You're in!",
      body: "A confirmation is on its way. See you there.",
      tone: "bg-green/10 text-green",
    },
    pending: {
      icon: Clock3,
      title: "Request received",
      body: "The host will review your request and let you know.",
      tone: "bg-amber/10 text-amber",
    },
    waitlist: {
      icon: TicketIcon,
      title: "You're on the waitlist",
      body: "We'll email you if a spot opens up.",
      tone: "bg-blue/10 text-blue",
    },
  }[status];
  const Icon = map.icon;
  return (
    <div className="rounded-xl border border-line bg-surface-2/50 p-5 text-center">
      <div
        className={cn(
          "mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full",
          map.tone,
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-base font-medium text-ink">{map.title}</p>
      <p className="mt-1 text-sm text-ink-secondary">{map.body}</p>
    </div>
  );
}
