import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Express } from "express";

const apiSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Social Media College API",
      version: "1.0.0",
    },
  },
  apis: ["**/*.controller.ts", "**/*.dto.ts"],
});

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiSpec));
};
