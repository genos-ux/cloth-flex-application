import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://dev_user:dev_pass@localhost:5433/clothflex",
  ssl: false,
  max: 1,
});

export const db = drizzle(pool);