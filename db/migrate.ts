import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

async function main() {
  const url = process.env.DATABASE_URL ?? "file:./luma.db";
  const client = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN });
  const db = drizzle(client);
  console.log("→ Applying migrations…");
  await migrate(db, { migrationsFolder: "./db/migrations" });
  console.log("✓ Migrations applied");
  client.close();
}

main().catch((err) => {
  console.error("✗ Migration failed:", err);
  process.exit(1);
});
