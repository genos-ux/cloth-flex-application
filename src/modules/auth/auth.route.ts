import { Router } from "express";
import { login } from "./auth.controller";


const authRoute: Router = Router();

authRoute.get("/login", login);


export default authRoute;