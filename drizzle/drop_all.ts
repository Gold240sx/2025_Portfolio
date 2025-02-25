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
const dropQuery = `
  DROP SCHEMA public CASCADE;
  CREATE SCHEMA public;
  GRANT ALL ON SCHEMA public TO postgres;
  GRANT ALL ON SCHEMA public TO public;
`;

async function main() {
  const sql = postgres(databaseUrl, {
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("Dropping all tables...");
    await sql.unsafe(dropQuery);
    console.log("All tables dropped successfully");
  } catch (error) {
    console.error("Failed to drop tables:", error);
    throw error;
  } finally {
    await sql.end();
    console.log("Database connection closed");
  }
}

main().catch((e) => {
  console.error("Failed to drop tables", e);
  process.exit(1);
});
