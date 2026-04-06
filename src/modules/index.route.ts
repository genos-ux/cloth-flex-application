import { Router } from "express";
import authRoute from "./auth/auth.route";

const indexRoute: Router = Router();

indexRoute.use("/auth", authRoute);

export default indexRoute;