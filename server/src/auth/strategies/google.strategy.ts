import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { serverConfig } from "../../config";
import { googleOauthConfig } from "../../config/google-oauth-config";
import { CreateExternalUserDTO } from "../../users/dto-schema";
import usersService from "../../users/users.service";

const googleAuth = new GoogleStrategy(
  {
    clientID: googleOauthConfig.clientId,
    clientSecret: googleOauthConfig.clientSecret,
    callbackURL: `${serverConfig.serverUrl}${googleOauthConfig.callbackEndpoint}`,
    proxy: true,
  },
  async (_accessToken, _refreshToken, profile, done) => {
    console.log(profile);

    try {
      const existingUser = await usersService.getUserByEmail(profile.email);

      if (existingUser) {
        const { password, externalId, ...otherFields } = existingUser;

        return done(null, { ...otherFields });
      }
    } catch (error) {
      console.log("Existing user not found, creating new user");
    }

    try {
      const userDTO: CreateExternalUserDTO = {
        name: profile.displayName as string,
        email: profile.email as string,
        birthDate: new Date().toJSON().split("T")[0],
        username: profile.email as string,
        externalId: profile.id as string,
        picture: profile.picture as string,
      };

      const user = await usersService.createUser(userDTO);

      done(null, user);
    } catch (error) {
      console.error("error with google user auth", error);
    }
  }
);

passport.use(googleAuth);
