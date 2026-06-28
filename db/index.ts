import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const url = process.env.DATABASE_URL ?? "file:./luma.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

// Reuse the client across hot reloads in dev to avoid exhausting handles.
const globalForDb = globalThis as unknown as {
  __lumaClient?: ReturnType<typeof createClient>;
};

const client =
  globalForDb.__lumaClient ?? createClient({ url, authToken });
if (process.env.NODE_ENV !== "production") globalForDb.__lumaClient = client;

export const db = drizzle(client, { schema });
export { schema };
