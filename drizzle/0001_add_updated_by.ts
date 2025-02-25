import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Use a fallback to ensure DATABASE_URL is a string
const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL || "";

if (databaseUrl == "") {
  console.log("❌ No ENV.DATABASE_URL found");
}

const migrationQuery = `
  ALTER TABLE "site_content" 
  ADD COLUMN IF NOT EXISTS "updated_by" varchar(255);
`;

async function main() {
  const sql = postgres(databaseUrl, {
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("Running migration...");
    await sql.unsafe(migrationQuery);
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    await sql.end();
    console.log("Database connection closed");
  }
}

main().catch((e) => {
  console.error("Migration failed", e);
  process.exit(1);
});
