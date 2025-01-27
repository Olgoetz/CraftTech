import config from "@/lib/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql, casing: "snake_case" });

// import { Pool, neonConfig } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-serverless";
// import ws from "ws";
// neonConfig.webSocketConstructor = ws;
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// export const db = drizzle({ client: pool });
