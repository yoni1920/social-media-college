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
  getAuthCookies,
} from "../utils/tests";
import { UserModel } from "./user.model";

let app: Express;
let authCookies: string[];

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
    const { accessToken } = authService.buildLoginTokens(adminUser._id);
    authCookies = getAuthCookies(accessToken.token);

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
  const response = await request
    .agent(app)
    .get(`/users/${exampleUser._id}`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);
  expect(response.body._id).toBe(exampleUser._id);
});

test("Get User by id - fail", async () => {
  const response = await request
    .agent(app)
    .get(`/users/123`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(400);
});

test("Get all users - pass", async () => {
  const response = await request
    .agent(app)
    .get("/users")
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);
  expect(response.body.length).toBe(2);
});

test("Delete User by id - pass", async () => {
  const response = await request
    .agent(app)
    .delete(`/users/${exampleUser._id}`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(200);

  const response2 = await request
    .agent(app)
    .get(`/users/${exampleUser._id}`)
    .set("Cookie", authCookies);

  expect(response2.statusCode).toBe(400);
});

test("Delete User by id - fail", async () => {
  const response = await request
    .agent(app)
    .delete(`/users/123`)
    .set("Cookie", authCookies);

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe("User did not exist");
});

test("Update User by id - pass", async () => {
  const response = await request
    .agent(app)
    .put(`/users/${exampleUser._id}`)
    .set("Cookie", authCookies)
    .send({ username: "New Username" });

  expect(response.statusCode).toBe(200);

  const response2 = await request
    .agent(app)
    .get(`/users/${exampleUser._id}`)
    .set("Cookie", authCookies);

  expect(response2.statusCode).toBe(200);

  expect(response2.body.username).toBe("New Username");
});

test("Update User by id - fail", async () => {
  const response = await request
    .agent(app)
    .put(`/users/123`)
    .set("Cookie", authCookies)
    .send({ username: "New Username" });

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("User to update does not exist");
});

test("Create user - pass", async () => {
  const response = await request
    .agent(app)
    .post("/users")
    .set("Cookie", authCookies)
    .send(exampleNewUser);

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("created new user");
});

test("Create duplicate username - fail", async () => {
  const { username: _, email: __, ...otherData } = exampleNewUser;

  const newUser = {
    ...otherData,
    email: "12345@gmail.com",
    username: adminUser.username,
  };

  const response = await request
    .agent(app)
    .post("/users")
    .set("Cookie", authCookies)
    .send(newUser);

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("username already exists");
});

test("Create duplicate email - fail", async () => {
  const { email: _, username: __, ...otherData } = exampleNewUser;

  const newUser = {
    ...otherData,
    username: "12331231234",
    email: adminUser.email,
  };

  const response = await request
    .agent(app)
    .post("/users")
    .set("Cookie", authCookies)
    .send(newUser);

  expect(response.statusCode).toBe(400);
  expect(response.body.message).toBe("email already exists");
});
