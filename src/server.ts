import dotenv from "dotenv";
dotenv.config();

import express from "express";


const app = express();

// Middleware
app.use(express.json());


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Express server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});