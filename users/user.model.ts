import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { BaseResource } from "../types/base-resource";

export interface User extends BaseResource {
  username: string;
  email: string;
  bio?: string;
  birthDate: Date;
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
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
    birthDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const USER_POPULATE_FIELDS = {
  field: "sender",
  subFields: ["username"],
} as const;

export const UserModel = model<User>("User", userSchema);
