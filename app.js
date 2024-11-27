import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import serverConfig from "./config/server-config.js";
import dbConfig from "./config/db-config.js";
import postsController from "./posts/posts.controller.js";
import commentsController from "./comments/comments.controller.js";
import usersController from "./users/users.controller.js";
import { handleGeneralError } from "./middleware/general-error-handler.js";
import { noRouteFoundHandler } from "./middleware/no-route-handler.js";

const initApp = async () => {
  const port = serverConfig.port;

  const app = express();
  app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
  app.use(bodyParser.json());

  app.use("/posts", postsController);
  app.use("/comments", commentsController);
  app.use("/users", usersController);

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
    const errorLog = {
      message: error.message,
      stack: error.stack,
    };

    console.error(errorLog);
  }

  return app;
};
export default initApp;
