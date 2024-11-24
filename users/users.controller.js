import express from "express";
import { validateBody } from "../middleware/body-validator.js";
import { createUserSchema } from "./dto-schema/create-user.dto.js";
import { updateUserSchema } from "./dto-schema/update-user.dto.js";
import usersService from "./users.service.js";

const router = express.Router();

router.post("/", validateBody(createUserSchema), async (req, res) => {
  const { id, createdAt } = await usersService.createUser(req.body);

  res.send({
    message: "created new user",
    userID: id,
    date: createdAt,
  });
});

router.get("/", async (_req, res) => {
  const users = await usersService.getAllUsers();

  res.send(users);
});

router.get("/:userID", async (req, res) => {
  const userID = req.params.userID;
  const user = await usersService.getUserByID(userID);

  res.send(user);
});

router.put("/:userID", validateBody(updateUserSchema), async (req, res) => {
  const userID = req.params.userID;
  const userDTO = req.body;

  const updatedAt = await usersService.updateUser(userID, userDTO);

  res.send({
    message: "User updated",
    userID,
    date: updatedAt,
  });
});

router.delete("/:userID", async (req, res) => {
  const userID = req.params.userID;

  const isDeleted = await usersService.deleteUser(userID);

  res.send({
    message: isDeleted ? "User deleted" : "User did not exist",
    userID,
  });
});

export default router;
