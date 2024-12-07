import jwt from "jsonwebtoken";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userID: string;
  }
}
