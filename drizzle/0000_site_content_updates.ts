import { sql } from "drizzle-orm";
import { pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const siteContent = pgTable("T3Test_site_content", {
  key: varchar("key", { length: 255 }).primaryKey(),
  content: text("content"),
  title: text("title"),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by", { length: 255 }),
});

export async function up(db: any) {
  await db.schema
    .alterTable("T3Test_site_content")
    .addColumn("updated_by", "varchar(255)");
}

export async function down(db: any) {
  await db.schema.alterTable("T3Test_site_content").dropColumn("updated_by");
}
