import { Schema, model } from "mongoose";
import { v4 as uuidV4 } from "uuid";

// TODO: add delete pre middleware
const userSchema = new Schema(
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
};

export const User = model("User", userSchema);
