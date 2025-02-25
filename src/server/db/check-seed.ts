// Simple script to verify that the seed.ts file is being executed properly
console.log("✅ check-seed.ts is being executed");
console.log("Current file path:", import.meta.url);
console.log("Process argv[1]:", process.argv[1]);

// Check if the DATABASE_URL environment variable is set
import { env } from "~/env";
console.log("DATABASE_URL is set:", !!env.DATABASE_URL);

// Exit with success
console.log("✅ check-seed.ts completed successfully");
