
import { db } from "../../config/db";
import { User } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function findUserByEmail(email: string) {
  try {
    const users = await db
      .select()
      .from(User)
      .where(eq(User.email, email));

    //console.log("Query result:", users);
    return users[0];
  } catch (err) {
    console.error("Drizzle query failed:", err);
    throw err;
  }
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "customer";
}) {
  const result = await db
    .insert(User)
    .values({
      ...data,
      role: data.role ?? "customer",
    })
    .returning();

  return result[0];
}