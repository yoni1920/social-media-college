import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { serverConfig, dbConfig } from "./config";
import postsController from "./posts/posts.controller";
import commentsController from "./comments/comments.controller";
import usersController from "./users/users.controller";
import authController from "./auth/auth.controller";
import { handleGeneralError } from "./middleware/general-error-handler";
import { noRouteFoundHandler } from "./middleware/no-route-handler";
import { setupSwagger } from "./swagger/setupSwagger";
import cookieParser from "cookie-parser";
import { validateAccessToken } from "./auth/middleware";

const initApp = async () => {
  const port = serverConfig.port;

  const app = express();
  app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use("/posts", validateAccessToken, postsController);
  app.use("/comments", validateAccessToken, commentsController);
  app.use("/users", validateAccessToken, usersController);
  app.use("/auth", authController);

  setupSwagger(app);

  app.use(noRouteFoundHandler);
  app.use(handleGeneralError);

  try {
    mongoose.connection.on("open", () => console.log("Connected to mongo"));
    mongoose.connection.on("error", (error) => console.error(error));
    await mongoose.connect(dbConfig.connectionUrl);

    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    const exception = error as Error;

    const errorLog = {
      message: exception.message,
      stack: exception.stack,
    };

    console.error(errorLog);
  }

  return app;
};

export default initApp;
