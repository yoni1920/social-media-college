import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { BaseResource } from "../types/resources";

export interface User extends BaseResource {
  username: string;
  password: string;
  email: string;
  bio?: string;
  name?: string;
  externalId?: string;
  picture: string;
}

const userSchema = new Schema<User>(
  {
    _id: {
      type: String,
      default: uuidV4,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    externalId: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    picture: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const USER_POPULATE_FIELDS = {
  field: "sender",
  subFields: ["username", "name", "picture"],
} as const;

export const USER_FIELDS_WITHOUT_SENSITIVE = ["-password", "-googleId"];

export const UserModel = model<User>("User", userSchema);
