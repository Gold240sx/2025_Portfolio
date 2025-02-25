// Simple script to test database connection
console.log("🚀 Starting database connection test");

import postgres from "postgres";

async function testConnection() {
  console.log("🔌 Attempting to connect to database...");

  try {
    // Use the same connection string as in seed.ts
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

    // Test a simple query
    console.log("🔍 Testing simple query...");
    const result = await connection`SELECT 1 as test`;
    console.log("✅ Query result:", result);

    // Check if tables exist
    console.log("🔍 Checking if tables exist...");
    const tables = await connection`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(
      "📋 Tables in database:",
      tables.map((t) => t.table_name),
    );

    // Close connection
    console.log("🔌 Closing database connection...");
    await connection.end();
    console.log("👋 Database connection closed");

    return true;
  } catch (error) {
    console.error("❌ Database connection error:", error);
    return false;
  }
}

// Run the test
testConnection()
  .then((success) => {
    if (success) {
      console.log("🎉 Database connection test completed successfully");
      process.exit(0);
    } else {
      console.error("💥 Database connection test failed");
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("💥 Unexpected error:", err);
    process.exit(1);
  });
