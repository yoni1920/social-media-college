import { Express } from "express";
import mongoose from "mongoose";
import request from "supertest";
import initApp from "../app";
import authService from "../auth/auth.service";
import { PostModel } from "../posts/models/post.model";
import { UserModel } from "../users/user.model";
import {
  exampleComment,
  examplePost,
  exampleUser,
  flushCollections,
  getAuthCookies,
} from "../utils/tests";
import { CommentModel } from "./comment.model";
import { cp } from "fs/promises";

let app: Express;
let authCookies: string[];

const pathToPostImage = "./public/images/default.webp";

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
    const { accessToken } = authService.buildLoginTokens(exampleUser._id);
    authCookies = getAuthCookies(accessToken.token);

    await flushCollections();
    await UserModel.create(exampleUser);
    const fileName = `${Date.now()}-${examplePost._id}.webp`;
    await cp(pathToPostImage, `./storage/posts/${fileName}`);
    await PostModel.create({ ...examplePost, fileName });
  });
});

beforeEach(async () => {
  if (!(await CommentModel.exists({ _id: exampleComment._id }))) {
    await CommentModel.create(exampleComment);
  }
});

afterAll(async () => {
  await flushCollections();

  await mongoose.connection.close();
});

test("Get Comment by id - pass", async () => {
  const response = await request
    .agent(app)
    .get(`/comments/${exampleComment._id}`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);
  expect(response.body._id).toBe(exampleComment._id);
});

test("Get Comment by id - fail", async () => {
  const response = await request
    .agent(app)
    .get(`/comments/123`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(400);
});

test("Get all comments - pass", async () => {
  const response = await request
    .agent(app)
    .get("/comments")
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);
  expect(response.body.docs[0]._id).toBe(exampleComment._id);
});

test("Get comments by post id - pass", async () => {
  const response = await request
    .agent(app)
    .get(`/comments?postID=${examplePost._id}`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);
  expect(response.body.docs[0].postID).toBe(examplePost._id);
});

test("Delete Comment by id - pass", async () => {
  const response = await request
    .agent(app)
    .delete(`/comments/${exampleComment._id}`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);

  const response2 = await request
    .agent(app)
    .get(`/comments/${exampleComment._id}`)
    .set("Cookie", authCookies);

  expect(response2.statusCode).toBe(400);
});

test("Delete Comment by id - fail", async () => {
  const response = await request
    .agent(app)
    .delete(`/comments/123`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe("Comment did not exist");
});

test("Update Comment by id - pass", async () => {
  const response = await request
    .agent(app)
    .put(`/comments/${exampleComment._id}`)
    .send({ message: "New Comment" })
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);

  const response2 = await request
    .agent(app)
    .get(`/comments/${exampleComment._id}`)
    .set("Cookie", authCookies);

  expect(response2.statusCode).toBe(200);

  expect(response2.body.message).toBe("New Comment");
});

test("Update Comment by id - fail", async () => {
  const response = await request
    .agent(app)
    .put(`/comments/123`)
    .send({ message: "New Comment" })
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Comment to update does not exist");
});

test("Create comment - pass", async () => {
  const response = await request
    .agent(app)
    .post("/comments")
    .set("Cookie", authCookies)
    .send({
      message: "New Comment",
      sender: exampleUser._id,
      postID: examplePost._id,
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("created new comment");
});
