"use client";

import { Globe, Loader2, MapPin, Sparkles } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { createEvent, type CreateState } from "@/app/actions/events";
import { EventCover, THEME_STOPS } from "@/components/event-cover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const THEMES = Object.keys(THEME_STOPS);
const PATTERNS = ["aurora", "mesh", "rings", "grid", "confetti"];

const fieldCls =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-tertiary focus:border-ink/40 focus:ring-4 focus:ring-ink/5";

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CreateEventForm({
  signedIn,
  prefill,
}: {
  signedIn: boolean;
  prefill?: { name: string; email: string };
}) {
  const [state, action, pending] = useActionState<CreateState, FormData>(
    createEvent,
    {},
  );

  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("indigo");
  const [pattern, setPattern] = useState("aurora");
  const [locationType, setLocationType] = useState<"physical" | "online" | "tbd">("physical");
  const [priceType, setPriceType] = useState<"free" | "paid">("free");
  const [tz, setTz] = useState("America/Los_Angeles");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const s = new Date();
    s.setHours(s.getHours() + 1, 0, 0, 0);
    const e = new Date(s);
    e.setHours(e.getHours() + 2);
    setStart(toLocalInput(s));
    setEnd(toLocalInput(e));
  }, []);

  return (
    <form
      action={action}
      className="grid gap-8 md:grid-cols-[minmax(0,340px)_1fr]"
    >
      <input type="hidden" name="timezone" value={tz} />
      <input type="hidden" name="themeColor" value={theme} />
      <input type="hidden" name="coverPattern" value={pattern} />
      <input type="hidden" name="locationType" value={locationType} />
      <input type="hidden" name="priceType" value={priceType} />

      {/* LEFT: cover + theme */}
      <aside className="space-y-4 md:sticky md:top-24 md:self-start">
        <EventCover
          theme={theme}
          pattern={pattern}
          title={title || "Your Event Title"}
          showTitle
          className="aspect-square w-full shadow-card"
        />
        <div>
          <p className="mb-2 text-[13px] font-medium text-ink-secondary">Color</p>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                aria-label={t}
                className={cn(
                  "h-7 w-7 rounded-full ring-offset-2 transition-transform hover:scale-110",
                  theme === t && "ring-2 ring-ink",
                )}
                style={{
                  background: `linear-gradient(135deg, ${THEME_STOPS[t][0]}, ${THEME_STOPS[t][2]})`,
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[13px] font-medium text-ink-secondary">Pattern</p>
          <div className="flex flex-wrap gap-2">
            {PATTERNS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPattern(p)}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-[12px] capitalize transition-colors",
                  pattern === p
                    ? "border-ink bg-ink text-white"
                    : "border-line text-ink-secondary hover:border-line-strong",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* RIGHT: fields */}
      <div className="space-y-5">
        <input
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Name"
          className="w-full bg-transparent text-3xl font-medium tracking-tight text-ink outline-none placeholder:text-ink-tertiary"
          autoFocus
        />

        <div className="card space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-ink-secondary">Starts</span>
              <input type="datetime-local" name="startAt" value={start} onChange={(e) => setStart(e.target.value)} className={fieldCls} required />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-ink-secondary">Ends</span>
              <input type="datetime-local" name="endAt" value={end} onChange={(e) => setEnd(e.target.value)} className={fieldCls} />
            </label>
          </div>
          <p className="text-[12px] text-ink-tertiary">Timezone: {tz}</p>
        </div>

        {/* Location */}
        <div className="card space-y-4 p-5">
          <div className="flex gap-2">
            {([
              ["physical", "In Person", MapPin],
              ["online", "Online", Globe],
              ["tbd", "To be decided", Sparkles],
            ] as const).map(([val, label, Icon]) => (
              <button
                key={val}
                type="button"
                onClick={() => setLocationType(val)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] transition-colors",
                  locationType === val
                    ? "border-ink bg-surface-2 text-ink"
                    : "border-line text-ink-secondary hover:border-line-strong",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
          {locationType === "physical" && (
            <div className="space-y-3">
              <input name="locationName" placeholder="Venue name" className={fieldCls} />
              <input name="locationAddress" placeholder="Address" className={fieldCls} />
            </div>
          )}
          {locationType === "online" && (
            <input name="locationUrl" placeholder="Meeting link (Zoom, Meet, …)" className={fieldCls} />
          )}
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-ink-secondary">Description</span>
          <textarea
            name="description"
            rows={5}
            placeholder="Tell guests what your event is about…"
            className={cn(fieldCls, "resize-y")}
          />
        </label>

        {/* Options */}
        <div className="card space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-ink-secondary">Ticket</span>
              <div className="flex gap-2">
                {(["free", "paid"] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriceType(p)}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-[13px] capitalize transition-colors",
                      priceType === p ? "border-ink bg-surface-2 text-ink" : "border-line text-ink-secondary",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </label>
            {priceType === "paid" && (
              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-ink-secondary">Price (USD)</span>
                <input type="number" name="price" min="0" step="1" placeholder="25" className={fieldCls} />
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-ink-secondary">Capacity</span>
              <input type="number" name="capacity" min="1" placeholder="Unlimited" className={fieldCls} />
            </label>
            <label className="block">
              <span className="mb-1 block text-[13px] font-medium text-ink-secondary">Visibility</span>
              <select name="visibility" className={fieldCls}>
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
              </select>
            </label>
          </div>
          <label className="flex items-center gap-3 pt-1">
            <input type="checkbox" name="requiresApproval" className="h-4 w-4 rounded border-line-strong accent-[var(--color-ink)]" />
            <span className="text-sm text-ink">Require approval to join</span>
          </label>
        </div>

        {/* Host identity when not signed in */}
        {!signedIn && (
          <div className="card space-y-3 p-5">
            <p className="text-[13px] font-medium text-ink-secondary">
              You&apos;re hosting as
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="hostName" placeholder="Your name" defaultValue={prefill?.name} className={fieldCls} />
              <input type="email" name="hostEmail" placeholder="you@example.com" defaultValue={prefill?.email} className={fieldCls} required />
            </div>
            <p className="text-[12px] text-ink-tertiary">
              We&apos;ll create your account so you can manage this event.
            </p>
          </div>
        )}

        {state.error && (
          <p className="rounded-lg bg-brand-soft px-3 py-2 text-sm text-brand">
            {state.error}
          </p>
        )}

        <div className="flex justify-end pb-4">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin-slow" /> : "Create Event"}
          </Button>
        </div>
      </div>
    </form>
  );
}
