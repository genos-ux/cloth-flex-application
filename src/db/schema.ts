import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  boolean,
  text,
  numeric,
  jsonb
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

  // isVerified: boolean("is_verified")
  //   .default(false)
  //   .notNull(),

  role: userRoleEnum("role")
    .default("customer")
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow(),
});


export const Product = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: numeric("price", {
    precision: 10,
    scale: 2,
  }).notNull(),

  images: jsonb("images").$type<string[]>().notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});