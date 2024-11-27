import request from "supertest";
import initApp from "../app";
import { Post } from "../posts/post.model";
import mongoose from "mongoose";
import { User } from "../users/user.model";
import { flushCollections } from "../utils/flush-database";
import {
  examplePost,
  exampleUser,
  exampleComment,
} from "../utils/example-data";
import { Comment } from "./comment.model";

let app;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
    await flushCollections();
    await User.create(exampleUser);
    await Post.create(examplePost);
  });
});

beforeEach(async () => {
  if (!(await Comment.exists({ _id: exampleComment._id }))) {
    await Comment.create(exampleComment);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("Get Comment by id - pass", async () => {
  const response = await request(app).get(`/comments/${exampleComment._id}`);

  expect(response.statusCode).toBe(200);
  expect(response.body._id).toBe(exampleComment._id);
});

test("Get Comment by id - fail", async () => {
  const response = await request(app).get(`/comments/123`);

  expect(response.statusCode).toBe(400);
});

test("Get all comments - pass", async () => {
  const response = await request(app).get("/comments");

  expect(response.statusCode).toBe(200);
  expect(response.body[0]._id).toBe(exampleComment._id);
});

test("Get comments by post id - pass", async () => {
  const response = await request(app).get(
    `/comments?postID=${examplePost._id}`
  );

  expect(response.statusCode).toBe(200);
  console.log(response.body);
  expect(response.body[0].postID).toBe(examplePost._id);
});

test("Delete Comment by id - pass", async () => {
  const response = await request(app).delete(`/comments/${exampleComment._id}`);

  expect(response.statusCode).toBe(200);

  const response2 = await request(app).get(`/comments/${exampleComment._id}`);

  expect(response2.statusCode).toBe(400);
});

test("Delete Comment by id - fail", async () => {
  const response = await request(app).delete(`/comments/123`);

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe("Comment did not exist");
});

test("Update Comment by id - pass", async () => {
  const response = await request(app)
    .put(`/comments/${exampleComment._id}`)
    .send({ message: "New Comment" });

  expect(response.statusCode).toBe(200);

  const response2 = await request(app).get(`/comments/${exampleComment._id}`);

  expect(response2.statusCode).toBe(200);

  expect(response2.body.message).toBe("New Comment");
});

test("Update Comment by id - fail", async () => {
  const response = await request(app)
    .put(`/comments/123`)
    .send({ message: "New Comment" });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("Comment to update does not exist");
});

test("Create comment - pass", async () => {
  const response = await request(app).post("/comments").send({
    message: "New Comment",
    sender: exampleUser._id,
    postID: examplePost._id,
  });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("created new comment");
});
