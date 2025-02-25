import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "~/env";
import fs from "fs";
import path from "path";
import * as dotenv from "dotenv";
import { seed } from "./seed";

// Load environment variables
dotenv.config();

// Use a fallback to ensure DATABASE_URL is a string
const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL || "";
if (databaseUrl == "") {
  console.log("❌ No ENV.DATABASE_URL found");
}

export async function runMigrations() {
  console.log("🔌 Connecting to database...");

  const connection = postgres(databaseUrl, {
    max: 1,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // First run the enum migration
  try {
    const enumSql = fs.readFileSync(
      path.join(process.cwd(), "drizzle", "migrate_enums.sql"),
      "utf8",
    );
    await connection.unsafe(enumSql);
    console.log("✅ Enum migration completed");
  } catch (error) {
    console.log("Enum migration error (can be ignored if enums exist):", error);
  }

  // Then run the regular migrations
  const db = drizzle(connection);

  try {
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("✅ Migrations completed");

    // Run seeding after successful migration
    await seed();
    console.log("✅ Database seeded");
  } catch (error) {
    console.error("❌ Migration error:", error);
    throw error;
  } finally {
    await connection.end();
    console.log("🔌 Database connection closed");
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  runMigrations().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
}
