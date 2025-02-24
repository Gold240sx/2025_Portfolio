import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { env } from "~/env";

const runMigrate = async () => {
  const connection = postgres(env.DATABASE_URL);
  const db = drizzle(connection);

  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "drizzle" });

  console.log("Migrations complete!");

  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("Migration failed!");
  console.error(err);
  process.exit(1);
});
