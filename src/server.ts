import dotenv from "dotenv";
dotenv.config();

import express from "express";
import indexRoute from "./modules/index.route";


const app = express();


app.use(express.json());

app.use("/api", indexRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Express app running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});