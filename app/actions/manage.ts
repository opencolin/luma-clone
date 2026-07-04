"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { events, registrations } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({
  registrationId: z.string().min(1),
  status: z.enum(["going", "pending", "waitlist", "declined"]),
});

/** Host-only: change a guest's status (approve/decline/waitlist). */
export async function setRegistrationStatus(formData: FormData): Promise<void> {
  const parsed = schema.safeParse({
    registrationId: formData.get("registrationId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return;

  const user = await getCurrentUser();
  if (!user) return;

  // Verify the registration belongs to an event this user hosts.
  const row = await db
    .select({ hostId: events.hostId, slug: events.slug })
    .from(registrations)
    .innerJoin(events, eq(events.id, registrations.eventId))
    .where(eq(registrations.id, parsed.data.registrationId))
    .get();

  if (!row || row.hostId !== user.id) return;

  await db
    .update(registrations)
    .set({ status: parsed.data.status })
    .where(eq(registrations.id, parsed.data.registrationId));

  revalidatePath(`/${row.slug}/manage`);
  revalidatePath(`/${row.slug}`);
}
