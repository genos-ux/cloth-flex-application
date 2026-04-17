import swaggerJsdoc from "swagger-jsdoc";
import 'dotenv/config'

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Cloth Flex API",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:4000",
        description: "API Server",
      },
    ],
  },
  apis: ["./src/modules/**/*.ts",],
};

export const swaggerSpec =
  swaggerJsdoc(options);