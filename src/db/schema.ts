import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";


export const userRoleEnum = pgEnum(
  "user_role",
  ["admin", "customer"]
);

export const User = pgTable("User", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }),

  email: varchar("email", { length: 255 })
    .unique()
    .notNull(),

  password: varchar("password", {
    length: 255,
  }).notNull(),

  role: userRoleEnum("role")
    .default("customer")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow(),
});