-- Drop existing enum if it exists
DROP TYPE IF EXISTS "schoolType" CASCADE;

-- Recreate the enum
CREATE TYPE "schoolType" AS ENUM ('high_school', 'college', 'bootcamp'); 