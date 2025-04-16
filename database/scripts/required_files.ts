import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL as string);

export const db = drizzle({ client: sql, casing: "snake_case" });
import { fileTypes } from "../schema";

export const insertRequiredFiles = async () => {
  await db
    .insert(fileTypes)
    .values([
      { name: "Business License" },
      { name: "Insurance" },
      { name: "Financial Statement" },
    ]);
};

insertRequiredFiles();
