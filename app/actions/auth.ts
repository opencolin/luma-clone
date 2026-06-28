"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, findOrCreateUser } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  name: z.string().max(120).optional(),
  next: z.string().optional(),
});

export type SignInState = { error?: string };

export async function signIn(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") || undefined,
    next: formData.get("next") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await findOrCreateUser(parsed.data.email, parsed.data.name);
  await createSession(user.id);

  const dest = parsed.data.next;
  redirect(dest && dest.startsWith("/") ? dest : "/home");
}

export async function signOut() {
  await destroySession();
  redirect("/");
}
