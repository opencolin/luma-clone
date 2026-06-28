import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { CreateEventForm } from "@/components/create-event-form";
import { SiteNav } from "@/components/site-nav";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create Event",
  description: "Set up a beautiful event page in seconds.",
};

export default async function CreatePage() {
  const user = await getCurrentUser();
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="mb-8 text-3xl tracking-tight sm:text-4xl">Create Event</h1>
        <CreateEventForm
          signedIn={!!user}
          prefill={user ? { name: user.name, email: user.email } : undefined}
        />
      </main>
      <Footer />
    </>
  );
}
