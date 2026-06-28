"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { signIn, type SignInState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

const fieldCls =
  "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-tertiary focus:border-ink/40 focus:ring-4 focus:ring-ink/5";

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    signIn,
    {},
  );

  return (
    <form action={action} className="space-y-3">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="block">
        <span className="mb-1 block text-[13px] font-medium text-ink-secondary">
          Email
        </span>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          autoFocus
          required
          className={fieldCls}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[13px] font-medium text-ink-secondary">
          Name <span className="text-ink-tertiary">(for new accounts)</span>
        </span>
        <input name="name" placeholder="Ada Lovelace" className={fieldCls} />
      </label>

      {state.error && <p className="text-[13px] text-brand">{state.error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin-slow" />
        ) : (
          <>
            Continue <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
      <p className="pt-1 text-center text-[12px] text-ink-tertiary">
        Passwordless — we&apos;ll sign you in or create your account instantly.
      </p>
    </form>
  );
}
