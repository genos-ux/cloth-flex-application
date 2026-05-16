import { Router } from "express";
import authRoute from "./auth/auth.route";
import productRoute from "./products/product.route.ts";
import categoryRoute from "./category/category.route.ts";
import cartRoute from "./carts/cart.route.ts";
import inventoryRoute from "./inventory/inventory.route.ts";
import orderRoute from "./orders/order.route.ts";
import customerRoute from "./customers/customers.route.ts";
import paymentRoute from "./payment/payment.route";

const indexRoute: Router = Router();

indexRoute.use("/auth", authRoute);
indexRoute.use("/products", productRoute);
indexRoute.use("/categories", categoryRoute);
indexRoute.use("/orders", orderRoute);
indexRoute.use("/cart", cartRoute);
indexRoute.use("/inventory", inventoryRoute);
indexRoute.use("/customers", customerRoute);
indexRoute.use("/payments", paymentRoute);


export default indexRoute;