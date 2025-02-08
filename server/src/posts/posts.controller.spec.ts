import { Express } from "express";
import mongoose from "mongoose";
import request from "supertest";
import initApp from "../app";
import { UserModel } from "../users/user.model";
import {
  flushCollections,
  examplePost,
  exampleUser,
  getAuthCookies,
} from "../utils/tests";
import { PostModel } from "./models/post.model";
import authService from "../auth/auth.service";

let app: Express;
let authCookies: string[];

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
    const { accessToken } = authService.buildLoginTokens(exampleUser._id);
    authCookies = getAuthCookies(accessToken.token);

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
  await flushCollections();

  await mongoose.connection.close();
});

test("Get Post by id - pass", async () => {
  const response = await request
    .agent(app)
    .get(`/posts/${examplePost._id}`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);
  expect(response.body._id).toBe(examplePost._id);
});

test("Get Post by id - fail", async () => {
  const response = await request
    .agent(app)
    .get(`/posts/123`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(400);
});

test("Get all posts - pass", async () => {
  const response = await request
    .agent(app)
    .get("/posts")
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);
  expect(response.body[0]._id).toBe(examplePost._id);
});

test("Get all posts by sender - pass", async () => {
  const response = await request
    .agent(app)
    .get(`/posts?senderID=${examplePost.sender}`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);
  expect(response.body[0]._id).toBe(examplePost._id);
});

test("Get all posts by sender - fail", async () => {
  const response = await request
    .agent(app)
    .get(`/posts?senderID=avnizzzz`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(0);
});

test("Delete Post by id - pass", async () => {
  const response = await request
    .agent(app)
    .delete(`/posts/${examplePost._id}`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);

  const response2 = await request
    .agent(app)
    .get(`/posts/${examplePost._id}`)
    .set("Cookie", authCookies);

  expect(response2.statusCode).toBe(400);
});

test("Delete Post by id - fail", async () => {
  const response = await request
    .agent(app)
    .delete(`/posts/123`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe("Post did not exist");
});

test("Update Post by id - pass", async () => {
  const response = await request
    .agent(app)
    .put(`/posts/${examplePost._id}`)
    .set("Cookie", authCookies)
    .send({ message: "I am Avni" });

  expect(response.statusCode).toBe(200);

  const response2 = await request
    .agent(app)
    .get(`/posts/${examplePost._id}`)
    .set("Cookie", authCookies);

  expect(response2.statusCode).toBe(200);

  expect(response2.body.message).toBe("I am Avni");
});

test("Update Post by id - fail", async () => {
  const response = await request
    .agent(app)
    .put(`/posts/123`)
    .set("Cookie", authCookies)
    .send({ message: "I am Avni" });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Post to update does not exist");
});

test("Create post - pass", async () => {
  const response = await request
    .agent(app)
    .post("/posts")
    .set("Cookie", authCookies)
    .send({ message: "I am Avni", sender: examplePost.sender });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("created new post");
});
