import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/logo";
import { SignInForm } from "@/components/sign-in-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Luma to host and manage events.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(next && next.startsWith("/") ? next : "/home");

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, rgba(244,63,142,0.12), transparent), radial-gradient(50% 40% at 50% 100%, rgba(99,102,241,0.12), transparent)",
        }}
      />
      <div className="w-full max-w-sm">
        <div className="card p-7">
          <div className="mb-6 flex flex-col items-center text-center">
            <LogoMark className="h-12 w-12" />
            <h1 className="mt-4 text-2xl tracking-tight">Welcome to Luma</h1>
            <p className="mt-1 text-sm text-ink-secondary">
              Please sign in or create an account to continue.
            </p>
          </div>
          <SignInForm next={next} />
        </div>
        <p className="mt-5 text-center text-[13px] text-ink-tertiary">
          <a href="/" className="hover:text-ink">
            ← Back to home
          </a>
        </p>
      </div>
    </main>
  );
}
