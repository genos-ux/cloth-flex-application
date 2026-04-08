import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { db } from "../config/db";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";


dotenv.config();

async function createAdmin() {
  try {
    const email = "admin@example.com";
    const name = "Admin User";
    const password = "Admin@123";

    //Check if admin already exists
    const existing = await db
      .select()
      .from(User)
      .where(eq(User.email, email));

    if (existing.length > 0) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [admin] = await db
      .insert(User)
      .values({
        name,
        email,
        password: hashedPassword,
        role: "admin",
        //isVerified: true,
      })
      .returning();

    console.log("Admin created successfully:", admin);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();