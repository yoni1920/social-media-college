import { UnauthorizedException } from "../exceptions";
import { User } from "../users/user.model";
import usersService from "../users/users.service";
import { LoginDTO } from "./dto-schema";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginTokens } from "./types";
import { ExpirySecs } from "./enums";
import { serverConfig } from "../config";
import { delay } from "../utils/delay";
import { INVALID_LOGIN_DELAY_MS } from "./constants";

const invalidCredentialsError = new UnauthorizedException(
  "User credentials do not match"
);

const loginUser = async (userCredentials: LoginDTO): Promise<LoginTokens> => {
  const { username, email, password } = userCredentials;

  const user = username
    ? await usersService.getUserByUsername(username)
    : await usersService.getUserByEmail(email as string);

  if (!user) {
    await delay(INVALID_LOGIN_DELAY_MS);

    throw invalidCredentialsError;
  }

  const { password: hashedPassword, ...otherUserData } = user;

  const isPasswordValid = await compare(password, hashedPassword);

  if (!isPasswordValid) {
    await delay(INVALID_LOGIN_DELAY_MS);

    throw invalidCredentialsError;
  }

  const userReturn: Omit<User, "password"> = {
    ...otherUserData,
  };

  const accessToken = jwt.sign(userReturn, serverConfig.accessTokenSecret, {
    expiresIn: ExpirySecs.TEN_MINUTES,
  });

  const refreshToken = jwt.sign({ username }, serverConfig.refreshTokenSecret, {
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

// const logoutUser = () => {

// }

export default {
  loginUser,
};
