import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "~/env";
import fs from "fs";
import path from "path";
import { seed } from "./seed";

export async function runMigrations() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  const connection = postgres(env.DATABASE_URL, {
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
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  runMigrations().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  });
}
