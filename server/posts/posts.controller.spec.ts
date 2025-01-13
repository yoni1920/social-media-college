import { Express } from "express";
import mongoose from "mongoose";
import request from "supertest";
import initApp from "../app";
import { UserModel } from "../users/user.model";
import {
  flushCollections,
  examplePost,
  exampleUser,
  getAuthHeader,
} from "../utils/tests";
import { PostModel } from "./post.model";
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
  });
});

beforeEach(async () => {
  if (!(await PostModel.exists({ _id: examplePost._id }))) {
    await PostModel.create(examplePost);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("Get Post by id - pass", async () => {
  const response = await request(app)
    .get(`/posts/${examplePost._id}`)
    .set(baseHeaders);

  expect(response.statusCode).toBe(200);
  expect(response.body._id).toBe(examplePost._id);
});

test("Get Post by id - fail", async () => {
  const response = await request(app).get(`/posts/123`).set(baseHeaders);

  expect(response.statusCode).toBe(400);
});

test("Get all posts - pass", async () => {
  const response = await request(app).get("/posts").set(baseHeaders);

  expect(response.statusCode).toBe(200);
  expect(response.body[0]._id).toBe(examplePost._id);
});

test("Get all posts by sender - pass", async () => {
  const response = await request(app)
    .get(`/posts?senderID=${examplePost.sender}`)
    .set(baseHeaders);

  expect(response.statusCode).toBe(200);
  expect(response.body[0]._id).toBe(examplePost._id);
});

test("Get all posts by sender - fail", async () => {
  const response = await request(app)
    .get(`/posts?senderID=avnizzzz`)
    .set(baseHeaders);

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(0);
});

test("Delete Post by id - pass", async () => {
  const response = await request(app)
    .delete(`/posts/${examplePost._id}`)
    .set(baseHeaders);

  expect(response.statusCode).toBe(200);

  const response2 = await request(app)
    .get(`/posts/${examplePost._id}`)
    .set(baseHeaders);

  expect(response2.statusCode).toBe(400);
});

test("Delete Post by id - fail", async () => {
  const response = await request(app).delete(`/posts/123`).set(baseHeaders);

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe("Post did not exist");
});

test("Update Post by id - pass", async () => {
  const response = await request(app)
    .put(`/posts/${examplePost._id}`)
    .set(baseHeaders)
    .send({ message: "I am Avni" });

  expect(response.statusCode).toBe(200);

  const response2 = await request(app)
    .get(`/posts/${examplePost._id}`)
    .set(baseHeaders);

  expect(response2.statusCode).toBe(200);

  expect(response2.body.message).toBe("I am Avni");
});

test("Update Post by id - fail", async () => {
  const response = await request(app)
    .put(`/posts/123`)
    .set(baseHeaders)
    .send({ message: "I am Avni" });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Post to update does not exist");
});

test("Create post - pass", async () => {
  const response = await request(app)
    .post("/posts")
    .set(baseHeaders)
    .send({ message: "I am Avni", sender: examplePost.sender });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("created new post");
});
