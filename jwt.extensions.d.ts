import { User } from "./users/user.model";
import jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userID: string;
    user: Omit<User, "password">;
  }
}
