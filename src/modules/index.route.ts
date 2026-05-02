import { Router } from "express";
import authRoute from "./auth/auth.route";
import productRoute from "./products/product.route.ts";
import categoryRoute from "./category/category.route.ts";
import cartRoute from "./carts/cart.route.ts";

const indexRoute: Router = Router();

indexRoute.use("/auth", authRoute);
indexRoute.use("/products", productRoute);
indexRoute.use("/categories", categoryRoute);
indexRoute.use("/orders", categoryRoute);
indexRoute.use("/carts", cartRoute);


export default indexRoute;