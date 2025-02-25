import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";

import { env } from "~/env";
import * as schema from "./schema";

// Load environment variables
dotenv.config();

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Use a fallback to ensure DATABASE_URL is a string
const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL || "";
if (databaseUrl == "") {
  console.log("❌ No ENV.DATABASE_URL found");
}

const conn =
  globalForDb.conn ??
  postgres(databaseUrl, {
    ssl: {
      rejectUnauthorized: false,
    },
    max: 1,
  });

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
