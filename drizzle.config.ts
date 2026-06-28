import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: (process.env.DATABASE_URL ?? "file:./luma.db").replace(/^file:/, ""),
  },
  verbose: true,
  strict: true,
});
