import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import express from "express";
import indexRoute from "./modules/index.route";
import { swaggerSpec } from "./config/swagger";
import cookieParser from "cookie-parser";
import {errorHandler} from "./middleware/errorHandler.ts";


const app = express();

dotenv.config();

app.use(express.json());


app.use(cookieParser());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use("/api", indexRoute);

app.use(errorHandler);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Express app running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});