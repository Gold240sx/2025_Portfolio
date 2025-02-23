"use server";
import { neon } from "@neondatabase/serverless";
import { env } from "../../env";

export async function getData() {
  const sql = neon(env.DATABASE_URL);
  const data = await sql`...`;
  return data;
}
