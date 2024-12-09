import { Express } from "express";
import mongoose from "mongoose";
import request, { Response } from "supertest";
import initApp from "../app";
import { UserModel } from "../users/user.model";
import {
  EXAMPLE_USER_PASSWORD_PLAINTEXT,
  exampleUser,
  exampleNewUser,
  flushCollections,
  getAuthHeader,
} from "../utils/tests";
import { REFRESH_TOKEN_COOKIE_KEY } from "./constants";
import { LoginTokens } from "./types";
import authService from "./auth.service";
import { serverConfig } from "../config";

let app: Express;
let loginTokens: LoginTokens;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
    loginTokens = authService.buildLoginTokens(exampleUser._id);

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

// TODO: login, without password

test("login with username - pass", async () => {
  const response = await request(app).post("/auth/login").send({
    username: exampleUser.username,
    password: EXAMPLE_USER_PASSWORD_PLAINTEXT,
  });

  expect(response.statusCode).toBe(200);
  expect(response.body.accessToken).toBeDefined();

  validateRefreshTokenCookie(response);
});

test("login with email - pass", async () => {
  const response = await request(app).post("/auth/login").send({
    email: exampleUser.email,
    password: EXAMPLE_USER_PASSWORD_PLAINTEXT,
  });

  expect(response.statusCode).toBe(200);
  expect(response.body.accessToken).toBeDefined();

  validateRefreshTokenCookie(response);
});

test("login email does not exist - fail", async () => {
  const response = await request(app).post("/auth/login").send({
    email: "whatisthisemail@gmail.com",
    password: EXAMPLE_USER_PASSWORD_PLAINTEXT,
  });

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe("User credentials do not match");
});

test("login username does not exist - fail", async () => {
  const response = await request(app).post("/auth/login").send({
    username: "whatisthisname",
    password: EXAMPLE_USER_PASSWORD_PLAINTEXT,
  });

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe("User credentials do not match");
});

test("login wrong password - fail", async () => {
  const response = await request(app).post("/auth/login").send({
    username: exampleUser.username,
    password: "INCORRECT",
  });

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe("User credentials do not match");
});

test("login without username or email - fail", async () => {
  const response = await request(app).post("/auth/login").send({
    password: EXAMPLE_USER_PASSWORD_PLAINTEXT,
  });

  expect(response.statusCode).toBe(400);
});

test("login without password - fail", async () => {
  const response = await request(app).post("/auth/login").send({
    username: "whatisthisname",
  });

  expect(response.statusCode).toBe(400);
});

test("refresh - pass", async () => {
  const { token: refreshToken } = loginTokens.refreshToken;

  const response = await request
    .agent(app)
    .post("/auth/refresh")
    .set("Cookie", [`${REFRESH_TOKEN_COOKIE_KEY}=${refreshToken}`]);

  expect(response.statusCode).toBe(200);
  expect(response.body.accessToken).toBeDefined();
});

test("refresh missing refresh token - fail", async () => {
  const response = await request(app).post("/auth/refresh");

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe("Missing refresh token");
});

test("refresh invalid refresh token - fail", async () => {
  const response = await request
    .agent(app)
    .post("/auth/refresh")
    .set("Cookie", [`${REFRESH_TOKEN_COOKIE_KEY}=hi`]);

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe("Invalid refresh token");
});

test("refresh invalid user on refresh token - fail", async () => {
  const { token: fakeUserRefreshToken } =
    authService.buildLoginTokens("fake_user").refreshToken;

  const response = await request
    .agent(app)
    .post("/auth/refresh")
    .set("Cookie", [`${REFRESH_TOKEN_COOKIE_KEY}=${fakeUserRefreshToken}`]);

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe(
    "Invalid Refresh Token User Identification"
  );
});

// TODO: register 200 OK

test("logout - pass", async () => {
  const { accessToken } = loginTokens;

  const response = await request(app)
    .post("/auth/logout")
    .set(getAuthHeader(accessToken));

  expect(response.statusCode).toBe(200);
});

test("logout/validate-access-token missing access token header - fail", async () => {
  const response = await request(app).post("/auth/logout");

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe("Missing authorization header");
});

test("logout/validate-access-token access token header without prefix - fail", async () => {
  const response = await request(app)
    .post("/auth/logout")
    .set({ [serverConfig.authorizationHeader]: loginTokens.accessToken });

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe(
    "Invalid authorization bearer header format"
  );
});

test("logout/validate-access-token invalid access token - fail", async () => {
  const response = await request(app)
    .post("/auth/logout")
    .set(getAuthHeader("faketoken"));

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe("Invalid access token");
});

test("logout/validate-access-token invalid user access token - fail", async () => {
  const { accessToken: fakeUserAccessToken } =
    authService.buildLoginTokens("fake_user");

  const response = await request(app)
    .post("/auth/logout")
    .set(getAuthHeader(fakeUserAccessToken));

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe(
    "Invalid Refresh Token User Identification"
  );
});

test("registration - pass", async () => {
  const response = await request(app)
    .post("/auth/registration")
    .send(exampleNewUser);

  expect(response.statusCode).toBe(200);
  expect(response.body.accessToken).toBeDefined();
  expect(response.body.message).toBe("successfully registered!");
  expect(response.body.userID).toBeDefined();
  expect(response.body.createdAt).toBeDefined();
});

const validateRefreshTokenCookie = (response: Response) => {
  const rawCookie = response.get("Set-Cookie");
  expect(rawCookie).toBeDefined();

  const includesRefreshToken = (rawCookie as string[])[0].startsWith(
    REFRESH_TOKEN_COOKIE_KEY
  );

  expect(includesRefreshToken).toBeTruthy();
};
