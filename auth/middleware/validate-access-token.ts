import { NextFunction, Request, Response } from "express";
import { serverConfig } from "../../config";
import { UnauthorizedException } from "../../exceptions";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../../users/user.model";

const authorizationPrefix = "Bearer";

declare module "express" {
  interface Request {
    user?: Omit<User, "password">;
  }
}

export const validateAccessToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const rawAccessToken = req.headers[serverConfig.authorizationHeader] as
    | string
    | undefined;

  if (!rawAccessToken) {
    throw new UnauthorizedException("Missing authorization header");
  }

  const [prefix, accessToken] = rawAccessToken.split(" ");

  if (prefix !== authorizationPrefix) {
    throw new UnauthorizedException(
      "Invalid authorization bearer header format"
    );
  }

  try {
    const { user } = jwt.verify(
      accessToken,
      serverConfig.accessTokenSecret
    ) as JwtPayload;

    req.user = user;

    next();
  } catch (error) {
    throw new UnauthorizedException(
      "Invalid access token",
      (error as Error).stack
    );
  }
};
