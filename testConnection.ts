// src/db/testConnection.ts
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function test() {
  try {
    await client.connect();
    console.log("✅ Connected to Neon DB!");
    await client.end();
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

test();