import { Router } from "express";
import authRoute from "./auth/auth.route";
import productRoute from "./products/product.route.ts";
import categoryRoute from "./category/category.route.ts";
import cartRoute from "./carts/cart.route.ts";
import inventoryRoute from "./inventory/inventory.route.ts";
import orderRoute from "./orders/order.route.ts";
import customerRoute from "./customers/customers.route.ts";

const indexRoute: Router = Router();

indexRoute.use("/auth", authRoute);
indexRoute.use("/products", productRoute);
indexRoute.use("/categories", categoryRoute);
indexRoute.use("/orders", orderRoute);
indexRoute.use("/carts", cartRoute);
indexRoute.use("/inventory", inventoryRoute);
indexRoute.use("/customers", customerRoute);


export default indexRoute;