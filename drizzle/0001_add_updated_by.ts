import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env";

const migrationQuery = `
  ALTER TABLE "T3Test_site_content" 
  ADD COLUMN IF NOT EXISTS "updated_by" varchar(255);
`;

async function main() {
  const sql = postgres(env.DATABASE_URL);
  const db = drizzle(sql);

  try {
    await sql.unsafe(migrationQuery);
    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
