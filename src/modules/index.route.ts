import { Router } from "express";
import authRoute from "./auth/auth.route";
import productRoute from "./products/product.route.ts";

const indexRoute: Router = Router();

indexRoute.use("/auth", authRoute);
indexRoute.use("/products", productRoute);

export default indexRoute;