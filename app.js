import express from "express";
import { serverConfig } from "./config/server-config.js";
import postsController from "./controllers/posts-controller.js";

const port = serverConfig.port;

const app = express();

app.use("/posts", postsController);

app.use("/", (_request, response) => {
  response.send({
    message: "your mom",
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
