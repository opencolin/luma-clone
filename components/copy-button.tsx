"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyButton({
  path,
  value,
  label = "Copy invite link",
  className,
}: {
  /** Relative path resolved against the current origin at copy time. */
  path?: string;
  /** Or an absolute value to copy verbatim. */
  value?: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text =
      value ?? (path ? window.location.origin + path : "");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked — no-op
    }
  }

  return (
    <button
      onClick={copy}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-[10px] border border-line-strong bg-surface px-3 text-sm font-medium text-ink transition-colors hover:bg-surface-2",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green" /> Copied
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4" /> {label}
        </>
      )}
    </button>
  );
}
