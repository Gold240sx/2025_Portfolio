import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "~/env";

const dropQuery = `
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  -- Drop all tables with cascade
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema() AND tablename LIKE 'T3Test_%') 
  LOOP
    EXECUTE 'DROP TABLE IF EXISTS "' || r.tablename || '" CASCADE';
  END LOOP;

  -- Drop all sequences
  FOR r IN (SELECT sequencename FROM pg_sequences WHERE schemaname = current_schema()) 
  LOOP
    EXECUTE 'DROP SEQUENCE IF EXISTS "' || r.sequencename || '" CASCADE';
  END LOOP;
END $$;
`;

async function main() {
  const sql = postgres(env.DATABASE_URL);

  try {
    await sql.unsafe(dropQuery);
    console.log("Successfully dropped all tables and sequences");
  } catch (error) {
    console.error("Failed to drop:", error);
  } finally {
    await sql.end();
  }
}

main().catch(console.error);
