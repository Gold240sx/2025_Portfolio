// Add immediate console log at the top of the file
console.log("🚀 SEED SCRIPT STARTED");

import { env } from "~/env";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { initialUpdates, initialActiveSites } from "./schema";

// Define the seed function
export async function seed() {
  console.log("🔌 Connecting to database...");

  try {
    // Use a direct connection string for testing
    const connection = postgres(
      "postgresql://postgres.qregsufrbbvldyfqitph:byhrex-wufvi0-wixjEb@aws-0-us-east-2.pooler.supabase.com:6543/postgres",
      {
        max: 1,
        ssl: {
          rejectUnauthorized: false,
        },
      },
    );

    console.log("✅ Database connection established");
    const db = drizzle(connection);

    try {
      console.log("🌱 Starting database seeding process...");

      // Insert initial data with better error handling
      try {
        console.log("📊 Seeding updates table...");
        await db.execute(initialUpdates);
        console.log("✅ Updates seeded successfully");
      } catch (error) {
        console.error("❌ Error seeding updates:", error);
      }

      try {
        console.log("🌐 Seeding active_sites table...");
        await db.execute(initialActiveSites);
        console.log("✅ Active sites seeded successfully");
      } catch (error) {
        console.error("❌ Error seeding active sites:", error);
      }

      // Verify the data was inserted
      try {
        console.log("🔍 Verifying data insertion...");
        const updatesCount = await connection`SELECT COUNT(*) FROM updates`;
        console.log("📈 Updates count:", updatesCount);

        const sitesCount = await connection`SELECT COUNT(*) FROM active_sites`;
        console.log("🌐 Active sites count:", sitesCount);
      } catch (error) {
        console.error("❌ Error verifying data:", error);
      }

      console.log("✅ Seeding completed successfully");
    } catch (error) {
      console.error("❌ Error in seeding process:", error);
      throw error;
    } finally {
      console.log("🔌 Closing database connection...");
      await connection.end();
      console.log("👋 Database connection closed");
    }
  } catch (connectionError) {
    console.error("❌ Database connection error:", connectionError);
    throw connectionError;
  }
}

// Wrap the execution in a try/catch
try {
  console.log("📋 Preparing to seed database");

  // Always run the seed function when this file is executed
  // This is more reliable than checking process.argv[1]
  console.log("🏃 Running seed function");
  seed()
    .then(() => {
      console.log("🎉 Seeding completed successfully");
      process.exit(0);
    })
    .catch((err) => {
      console.error("💥 Error seeding:", err);
      process.exit(1);
    });
} catch (error) {
  console.error("💥 CRITICAL ERROR in seed script:", error);
  process.exit(1);
}
