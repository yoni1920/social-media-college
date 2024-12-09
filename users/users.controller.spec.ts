import { Express } from "express";
import mongoose from "mongoose";
import request from "supertest";
import initApp from "../app";
import authService from "../auth/auth.service";
import {
  adminUser,
  exampleNewUser,
  exampleUser,
  flushCollections,
  getAuthHeader,
} from "../utils/tests";
import { UserModel } from "./user.model";

let app: Express;
let baseHeaders: Record<string, string>;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
    const { accessToken } = authService.buildLoginTokens(adminUser._id);
    baseHeaders = getAuthHeader(accessToken);

    await flushCollections();

    if (!(await UserModel.exists({ _id: adminUser._id }))) {
      await UserModel.create(adminUser);
    }
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
  const response = await request(app)
    .get(`/users/${exampleUser._id}`)
    .set(baseHeaders);

  expect(response.statusCode).toBe(200);
  expect(response.body._id).toBe(exampleUser._id);
});

test("Get User by id - fail", async () => {
  const response = await request(app).get(`/users/123`).set(baseHeaders);

  expect(response.statusCode).toBe(400);
});

test("Get all users - pass", async () => {
  const response = await request(app).get("/users").set(baseHeaders);

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(2);
});

test("Delete User by id - pass", async () => {
  const response = await request(app)
    .delete(`/users/${exampleUser._id}`)
    .set(baseHeaders);

  expect(response.statusCode).toBe(200);

  const response2 = await request(app)
    .get(`/users/${exampleUser._id}`)
    .set(baseHeaders);

  expect(response2.statusCode).toBe(400);
});

test("Delete User by id - fail", async () => {
  const response = await request(app).delete(`/users/123`).set(baseHeaders);

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe("User did not exist");
});

test("Update User by id - pass", async () => {
  const response = await request(app)
    .put(`/users/${exampleUser._id}`)
    .set(baseHeaders)
    .send({ username: "New Username" });

  expect(response.statusCode).toBe(200);

  const response2 = await request(app)
    .get(`/users/${exampleUser._id}`)
    .set(baseHeaders);

  expect(response2.statusCode).toBe(200);

  expect(response2.body.username).toBe("New Username");
});

test("Update User by id - fail", async () => {
  const response = await request(app)
    .put(`/users/123`)
    .set(baseHeaders)
    .send({ username: "New Username" });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("User to update does not exist");
});

test("Create user - pass", async () => {
  const response = await request(app)
    .post("/users")
    .set(baseHeaders)
    .send(exampleNewUser);

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("created new user");
});
