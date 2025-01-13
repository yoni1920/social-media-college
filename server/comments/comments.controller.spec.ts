import { Express } from "express";
import mongoose from "mongoose";
import request from "supertest";
import initApp from "../app";
import { PostModel } from "../posts/post.model";
import { UserModel } from "../users/user.model";
import {
  flushCollections,
  exampleComment,
  examplePost,
  exampleUser,
  getAuthHeader,
} from "../utils/tests";
import { CommentModel } from "./comment.model";
import authService from "../auth/auth.service";

let app: Express;
let baseHeaders: Record<string, string>;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
    const { accessToken } = authService.buildLoginTokens(exampleUser._id);
    baseHeaders = getAuthHeader(accessToken.token);

    await flushCollections();
    await UserModel.create(exampleUser);
    await PostModel.create(examplePost);
  });
});

beforeEach(async () => {
  if (!(await CommentModel.exists({ _id: exampleComment._id }))) {
    await CommentModel.create(exampleComment);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("Get Comment by id - pass", async () => {
  const response = await request(app)
    .get(`/comments/${exampleComment._id}`)
    .set(baseHeaders);

  expect(response.statusCode).toBe(200);
  expect(response.body._id).toBe(exampleComment._id);
});

test("Get Comment by id - fail", async () => {
  const response = await request(app).get(`/comments/123`).set(baseHeaders);

  expect(response.statusCode).toBe(400);
});

test("Get all comments - pass", async () => {
  const response = await request(app).get("/comments").set(baseHeaders);

  expect(response.statusCode).toBe(200);
  expect(response.body[0]._id).toBe(exampleComment._id);
});

test("Get comments by post id - pass", async () => {
  const response = await request(app)
    .get(`/comments?postID=${examplePost._id}`)
    .set(baseHeaders);

  expect(response.statusCode).toBe(200);
  expect(response.body[0].postID).toBe(examplePost._id);
});

test("Delete Comment by id - pass", async () => {
  const response = await request(app)
    .delete(`/comments/${exampleComment._id}`)
    .set(baseHeaders);

  expect(response.statusCode).toBe(200);

  const response2 = await request(app)
    .get(`/comments/${exampleComment._id}`)
    .set(baseHeaders);

  expect(response2.statusCode).toBe(400);
});

test("Delete Comment by id - fail", async () => {
  const response = await request(app).delete(`/comments/123`).set(baseHeaders);

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe("Comment did not exist");
});

test("Update Comment by id - pass", async () => {
  const response = await request(app)
    .put(`/comments/${exampleComment._id}`)
    .send({ message: "New Comment" })
    .set(baseHeaders);

  expect(response.statusCode).toBe(200);

  const response2 = await request(app)
    .get(`/comments/${exampleComment._id}`)
    .set(baseHeaders);

  expect(response2.statusCode).toBe(200);

  expect(response2.body.message).toBe("New Comment");
});

test("Update Comment by id - fail", async () => {
  const response = await request(app)
    .put(`/comments/123`)
    .send({ message: "New Comment" })
    .set(baseHeaders);

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Comment to update does not exist");
});

test("Create comment - pass", async () => {
  const response = await request(app).post("/comments").set(baseHeaders).send({
    message: "New Comment",
    sender: exampleUser._id,
    postID: examplePost._id,
  });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("created new comment");
});
