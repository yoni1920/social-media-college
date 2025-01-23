import { Express } from "express";
import mongoose from "mongoose";
import request from "supertest";
import initApp from "./app";

let app: Express;

beforeAll(async () => {
  await initApp().then(async (appInstance) => {
    app = appInstance;
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

test("no route handler - fails", async () => {
  const response = await request(app).get("/no-route");

  expect(response.statusCode).toBe(404);
  expect(response.body.message).toBe("Sorry can't find that!");
});
