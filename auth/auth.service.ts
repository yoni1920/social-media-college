import { compare } from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { serverConfig } from "../config";
import { UnauthorizedException } from "../exceptions";
import { User } from "../users/user.model";
import usersService from "../users/users.service";
import { delay } from "../utils/delay";
import { INVALID_LOGIN_DELAY_MS } from "./constants";
import { LoginDTO } from "./dto-schema";
import { ExpirySecs } from "./enums";
import { LoginTokens } from "./types";

const invalidCredentialsError = new UnauthorizedException(
  "User credentials do not match"
);

const loginUser = async (userCredentials: LoginDTO): Promise<LoginTokens> => {
  const user = await getUserByCredentials(userCredentials);

  if (!user) {
    await delay(INVALID_LOGIN_DELAY_MS);

    throw invalidCredentialsError;
  }

  const { password: hashedPassword, _id: userID } = user;

  const isPasswordValid = await compare(
    userCredentials.password,
    hashedPassword
  );

  if (!isPasswordValid) {
    await delay(INVALID_LOGIN_DELAY_MS);

    throw invalidCredentialsError;
  }

  return buildLoginTokens(userID);
};

const refreshAccessToken = async (
  refreshToken: string | undefined
): Promise<string> => {
  if (!refreshToken) {
    throw new UnauthorizedException("Missing refresh token");
  }

  try {
    const { userID } = jwt.verify(
      refreshToken,
      serverConfig.refreshTokenSecret
    ) as JwtPayload;

    const userResult = await usersService.doesUserExist(userID);

    if (!userResult) {
      throw new UnauthorizedException(
        "Invalid Refresh Token User Identification"
      );
    }

    return generateAccessToken(userResult._id);
  } catch (error) {
    throw new UnauthorizedException(
      "Invalid refresh token",
      (error as Error).stack
    );
  }
};

const getUserByCredentials = async ({
  username,
  email,
}: LoginDTO): Promise<User | undefined> => {
  return username
    ? await usersService.getUserByUsername(username)
    : await usersService.getUserByEmail(email as string);
};

const buildLoginTokens = (userID: string): LoginTokens => {
  const accessToken = generateAccessToken(userID);

  const refreshToken = jwt.sign({ userID }, serverConfig.refreshTokenSecret, {
    expiresIn: ExpirySecs.ONE_DAY,
  });

  return {
    accessToken,
    refreshToken: {
      token: refreshToken,
      cookieExpiry: ExpirySecs.ONE_DAY,
    },
  };
};

const generateAccessToken = (userID: string): string => {
  return jwt.sign({ userID }, serverConfig.accessTokenSecret, {
    expiresIn: ExpirySecs.TEN_MINUTES,
  });
};

export default {
  loginUser,
  buildLoginTokens,
  refreshAccessToken,
};
