import { Express } from "express";
import mongoose from "mongoose";
import request, { Response } from "supertest";
import initApp from "../app";
import { UserModel } from "../users/user.model";
import {
  EXAMPLE_USER_PASSWORD_PLAINTEXT,
  exampleNewUser,
  exampleUser,
  flushCollections,
} from "../utils/tests";
import authService from "./auth.service";
import { ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY } from "./constants";
import { LoginTokens } from "./types";

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
  await flushCollections();

  await mongoose.connection.close();
});

test("login with username - pass", async () => {
  const response = await request(app).post("/auth/login").send({
    username: exampleUser.username,
    password: EXAMPLE_USER_PASSWORD_PLAINTEXT,
  });

  expect(response.statusCode).toBe(200);
  expect(response.body.user).toBeDefined();

  validateTokenCookies(response);
});

test("login with email - pass", async () => {
  const response = await request(app).post("/auth/login").send({
    email: exampleUser.email,
    password: EXAMPLE_USER_PASSWORD_PLAINTEXT,
  });

  expect(response.statusCode).toBe(200);
  expect(response.body.user).toBeDefined();

  validateTokenCookies(response);
});

test("login email does not exist - fail", async () => {
  const response = await request(app).post("/auth/login").send({
    email: "whatisthisemail@gmail.com",
    password: EXAMPLE_USER_PASSWORD_PLAINTEXT,
  });

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe(
    "User identification and/or password are wrong"
  );
});

test("login username does not exist - fail", async () => {
  const response = await request(app).post("/auth/login").send({
    username: "whatisthisname",
    password: EXAMPLE_USER_PASSWORD_PLAINTEXT,
  });

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe(
    "User identification and/or password are wrong"
  );
});

test("login wrong password - fail", async () => {
  const response = await request(app).post("/auth/login").send({
    username: exampleUser.username,
    password: "INCORRECT",
  });

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe(
    "User identification and/or password are wrong"
  );
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
  expect(response.body.message).toBeDefined();
  expect(response.body.message).toBe("refreshed");
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

test("logout - pass", async () => {
  const response = await request.agent(app).post("/auth/logout");

  expect(response.statusCode).toBe(200);
});

test("me - pass", async () => {
  const response = await request
    .agent(app)
    .post("/auth/me")
    .set("Cookie", [
      `${ACCESS_TOKEN_COOKIE_KEY}=${loginTokens.accessToken.token}`,
    ]);

  expect(response.statusCode).toBe(200);
});

test("me/validate-access-token missing access token - fail", async () => {
  const response = await request.agent(app).post("/auth/me");

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe("Missing access token");
});

test("me/validate-access-token invalid access token - fail", async () => {
  const response = await request
    .agent(app)
    .post("/auth/me")
    .set("Cookie", [`${ACCESS_TOKEN_COOKIE_KEY}=${"faketoken"}`]);

  expect(response.statusCode).toBe(401);

  expect(response.body.message).toBe("User is unauthorized");
  expect(response.body.details).toBe("Invalid access token");
});

test("me/validate-access-token invalid user access token - fail", async () => {
  const {
    accessToken: { token: fakeUserAccessToken },
  } = authService.buildLoginTokens("fake_user");

  const response = await request
    .agent(app)
    .post("/auth/me")
    .set("Cookie", [`${ACCESS_TOKEN_COOKIE_KEY}=${fakeUserAccessToken}`]);

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
  expect(response.body.user).toBeDefined();

  validateTokenCookies(response);
});

const validateTokenCookies = (response: Response) => {
  const rawCookie = response.get("Set-Cookie");
  expect(rawCookie).toBeDefined();

  const tokenCookies = rawCookie as string[];
  expect(tokenCookies.length).toBe(2);

  const includesAccessToken = tokenCookies.some((cookie) =>
    cookie.startsWith(ACCESS_TOKEN_COOKIE_KEY)
  );

  const includesRefreshToken = tokenCookies.some((cookie) =>
    cookie.startsWith(REFRESH_TOKEN_COOKIE_KEY)
  );

  expect(includesAccessToken).toBeTruthy();
  expect(includesRefreshToken).toBeTruthy();
};
