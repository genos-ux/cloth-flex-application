
import { db } from "../../config/db";
import { User } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function findUserByEmail(email: string) {
  const users = await db
    .select()
    .from(User)
    .where(eq(User.email, email));

  return users[0];
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