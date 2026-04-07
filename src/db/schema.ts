import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";


export const userRoleEnum = pgEnum(
  "user_role",
  ["admin", "customer"]
);

export const User = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }),

  email: varchar("email", { length: 255 })
    .unique()
    .notNull(),

  password: varchar("password", {
    length: 255,
  }).notNull(),

  isVerified: boolean("is_verified")
    .default(false)
    .notNull(),

  role: userRoleEnum("role")
    .default("customer")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow(),
});