import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import config from "./config";

const neon = new Pool({
  connectionString: config.env.databaseUrl,
});
const adapter = new PrismaNeon(neon);
export const prisma = new PrismaClient({ adapter });
