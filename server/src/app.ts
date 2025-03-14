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
import cors from "cors";
import passport from "passport";
import http from "http";
import https from "https";
import fs from "fs";

const initApp = async () => {
  const port = serverConfig.port;

  const app = express();
  app.use(
    cors({
      origin: serverConfig.clientUrl,
      credentials: true,
    })
  );

  app.use("/images", express.static("public/images"));
  app.use(express.static("ui"));
  app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(passport.initialize());
  await import("./auth/strategies/google.strategy");

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

    if (serverConfig.env !== "PRODUCTION") {
      http.createServer(app).listen(port, () => {
        console.log(`Listening http on port ${port}`);
      });
    } else {
      const key = fs.readFileSync(__dirname + "/../certs/selfsigned.key");
      const cert = fs.readFileSync(__dirname + "/../certs/selfsigned.crt");
      const options = {
        key,
        cert,
      };

      https.createServer(options, app).listen(port, () => {
        console.log(`Listening https on port ${port}`);
      });
    }
  } catch (error) {
    const exception = error as Error;

    const errorLog = {
      message: exception.message,
      stack: exception.stack,
    };

    console.error(errorLog);

    process.exit(1);
  }

  return app;
};

export default initApp;
