"use client";

import { useEffect, useState } from "react";

/** Live local time shown in the nav, the way lu.ma does it. */
export function Clock({ className }: { className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <span className={className} suppressHydrationWarning />;

  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const tz =
    new Intl.DateTimeFormat("en-US", { timeZoneName: "short" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "";

  return (
    <span className={className} suppressHydrationWarning>
      {time} {tz}
    </span>
  );
}
