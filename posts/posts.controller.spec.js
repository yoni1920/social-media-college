import request from "supertest";
import initApp from "../app";
import { Post } from "./post.model";
import mongoose from "mongoose";
import { User } from "../users/user.model";
import { flushCollections } from "../utils/flush-database";
import { examplePost, exampleUser } from "../utils/example-data";

let app;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
    await flushCollections();
    await User.create(exampleUser);
  });
});

beforeEach(async () => {
  if (!(await Post.exists({ _id: examplePost._id }))) {
    await Post.create(examplePost);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("Get Post by id - pass", async () => {
  const response = await request(app).get(`/posts/${examplePost._id}`);

  expect(response.statusCode).toBe(200);
  expect(response.body._id).toBe(examplePost._id);
});

test("Get Post by id - fail", async () => {
  const response = await request(app).get(`/posts/123`);

  expect(response.statusCode).toBe(400);
});

test("Get all posts - pass", async () => {
  const response = await request(app).get("/posts");

  expect(response.statusCode).toBe(200);
  expect(response.body[0]._id).toBe(examplePost._id);
});

test("Delete Post by id - pass", async () => {
  const response = await request(app).delete(`/posts/${examplePost._id}`);

  expect(response.statusCode).toBe(200);

  const response2 = await request(app).get(`/posts/${examplePost._id}`);

  expect(response2.statusCode).toBe(400);
});

test("Delete Post by id - fail", async () => {
  const response = await request(app).delete(`/posts/123`);

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe("Post did not exist");
});

test("Update Post by id - pass", async () => {
  const response = await request(app)
    .put(`/posts/${examplePost._id}`)
    .send({ message: "I am Avni" });

  expect(response.statusCode).toBe(200);

  const response2 = await request(app).get(`/posts/${examplePost._id}`);

  expect(response2.statusCode).toBe(200);

  expect(response2.body.message).toBe("I am Avni");
});

test("Update Post by id - fail", async () => {
  const response = await request(app)
    .put(`/posts/123`)
    .send({ message: "I am Avni" });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Post to update does not exist");
});

test("Create post - pass", async () => {
  const response = await request(app)
    .post("/posts")
    .send({ message: "I am Avni", sender: examplePost.sender });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("created new post");
});
