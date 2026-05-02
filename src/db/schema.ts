import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  boolean,
  text,
  numeric,
  integer,
  jsonb
} from "drizzle-orm/pg-core";


export const userRoleEnum = pgEnum(
  "user_role",
  ["admin", "customer"]
);

export const productStatusEnum = pgEnum("product_status", [
  "IN_STOCK",
  "LOW",
  "CRITICAL",
  "OUT_OF_STOCK",
]);


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
  sku: varchar("sku", { length: 50 }).unique().notNull(),
  price: numeric("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  images: jsonb("images").$type<string[]>().notNull(),
  categoryId: uuid("category_id")
      .notNull()
      .references(() => Category.id, {
        onDelete: "cascade",
      }),
  size: varchar("size", {
    length: 10,
  }).notNull(),
  quantity: integer("quantity")
      .notNull()
      .default(0),
  level: integer("level")
      .notNull()
      .default(0),
  status: productStatusEnum("status")
      .notNull()
      .default("OUT_OF_STOCK"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});


export const Category = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100 }).notNull(),

  isVisible: boolean("is_visible")
      .default(true)
      .notNull(),

  productsCount: integer("products_count")
      .default(0)
      .notNull(),

  createdAt: timestamp("created_at")
      .defaultNow(),

  updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
});


export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "PAID",
  "SHIPPED",
  "CANCELLED",
]);


export const Order = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  
  userId: uuid("user_id").references(() => User.id, {
    onDelete: "set null",
  }),

  guestId: varchar("guest_id", { length: 255 }),

  email: varchar("email", { length: 255 }).notNull(),

  status: orderStatusEnum("status").default("PENDING").notNull(),

  totalAmount: numeric("total_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const OrderItem = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
      .references(() => Order.id, { onDelete: "cascade" })
      .notNull(),

  productId: uuid("product_id")
      .references(() => Product.id)
      .notNull(),

  quantity: integer("quantity").notNull(),

  price: numeric("price", {
    precision: 10,
    scale: 2,
  }).notNull(),
});

export const Cart = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
      .references(() => User.id, {
        onDelete: "cascade",
      })
      .notNull(),

  createdAt: timestamp("created_at")
      .defaultNow(),
});


export const CartItem = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  cartId: uuid("cart_id")
      .references(() => Cart.id, {
        onDelete: "cascade",
      })
      .notNull(),

  productId: uuid("product_id")
      .references(() => Product.id)
      .notNull(),

  quantity: integer("quantity")
      .notNull()
      .default(1),

  createdAt: timestamp("created_at")
      .defaultNow(),
});