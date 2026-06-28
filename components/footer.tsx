import Link from "next/link";
import { Logo } from "@/components/logo";

const PRODUCT = [
  { label: "Explore Events", href: "/discover" },
  { label: "Pricing", href: "/pricing" },
  { label: "Create Event", href: "/create" },
  { label: "Help", href: "/help" },
];

const LEGAL = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Security", href: "/security" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-bg">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-[13px] text-ink-tertiary">
            Delightful events start here.
          </p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:ml-auto">
          {PRODUCT.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] text-ink-secondary transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-start gap-3 px-4 py-5 text-[13px] text-ink-tertiary sm:flex-row sm:items-center sm:px-6">
          <span>
            An open-source Luma clone · Built with Next.js
          </span>
          <nav className="flex items-center gap-5 sm:ml-auto">
            {LEGAL.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.480-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
