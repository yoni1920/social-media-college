import { hashSync } from "bcrypt";
import { USER_PASSWORD_SALT_ROUNDS } from "../../users/constants";

export const EXAMPLE_USER_PASSWORD_PLAINTEXT = "thebestpassword";

export const examplePost = {
  _id: "1234",
  sender: "Avni",
  message: "I am Avnizz",
};

export const exampleUser = {
  _id: "Avni",
  username: "idoavni",
  password: hashSync(
    EXAMPLE_USER_PASSWORD_PLAINTEXT,
    USER_PASSWORD_SALT_ROUNDS
  ),
  email: "3C5oB@example.com",
  bio: "King",
  name: "Ido Avni",
  picture: "example",
};

export const adminUser = {
  _id: "ADMIN",
  username: "admin",
  password: hashSync(
    EXAMPLE_USER_PASSWORD_PLAINTEXT,
    USER_PASSWORD_SALT_ROUNDS
  ),
  email: "admin@example.com",
  bio: "admin",
  picture: "example",
};

export const exampleNewUser = {
  username: "New User",
  password: "1234",
  email: "newuser@example.com",
  name: "",
};

export const exampleComment = {
  _id: "1234-5678",
  sender: "Avni",
  message: "I am Avnizz",
  postID: "1234",
};
