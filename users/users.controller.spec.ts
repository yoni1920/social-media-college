import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { UserModel } from "./user.model";
import { flushCollections } from "../utils/flush-database";
import { exampleUser } from "../utils/example-data";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
    await flushCollections();
  });
});

beforeEach(async () => {
  if (!(await UserModel.exists({ _id: exampleUser._id }))) {
    await UserModel.create(exampleUser);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("Get User by id - pass", async () => {
  const response = await request(app).get(`/users/${exampleUser._id}`);

  expect(response.statusCode).toBe(200);
  expect(response.body._id).toBe(exampleUser._id);
});

test("Get User by id - fail", async () => {
  const response = await request(app).get(`/users/123`);

  expect(response.statusCode).toBe(400);
});

test("Get all users - pass", async () => {
  const response = await request(app).get("/users");

  expect(response.statusCode).toBe(200);
  expect(response.body[0]._id).toBe(exampleUser._id);
});

test("Delete User by id - pass", async () => {
  const response = await request(app).delete(`/users/${exampleUser._id}`);

  expect(response.statusCode).toBe(200);

  const response2 = await request(app).get(`/users/${exampleUser._id}`);

  expect(response2.statusCode).toBe(400);
});

test("Delete User by id - fail", async () => {
  const response = await request(app).delete(`/users/123`);

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe("User did not exist");
});

test("Update User by id - pass", async () => {
  const response = await request(app)
    .put(`/users/${exampleUser._id}`)
    .send({ username: "New Username" });

  expect(response.statusCode).toBe(200);

  const response2 = await request(app).get(`/users/${exampleUser._id}`);

  expect(response2.statusCode).toBe(200);

  expect(response2.body.username).toBe("New Username");
});

test("Update User by id - fail", async () => {
  const response = await request(app)
    .put(`/users/123`)
    .send({ username: "New Username" });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("User to update does not exist");
});

test("Create user - pass", async () => {
  const response = await request(app).post("/users").send({
    username: "New User",
    email: "newuser@example.com",
    birthDate: "1990-01-01",
  });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("created new user");
});
