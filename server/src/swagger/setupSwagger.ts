import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Express } from "express";
import { ACCESS_TOKEN_COOKIE_KEY } from "../auth/constants";

const apiSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Social Media College API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: ACCESS_TOKEN_COOKIE_KEY,
        },
      },
    },
  },
  apis: ["**/*.controller.ts", "**/*.dto.ts"],
});

export const setupSwagger = (app: Express) => {
  app.use("/api", swaggerUi.serve, swaggerUi.setup(apiSpec));
};
