import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { serverConfig } from "../../config";
import { googleOauthConfig } from "../../config/google-oauth-config";
import { CreateExternalUserDTO } from "../../users/dto-schema";
import usersService from "../../users/users.service";
import { USER_PICTURE_STORAGE_PATH } from "../../users/constants";
import storageService from "../../file-storage/storage.service";

const googleAuth = new GoogleStrategy(
  {
    clientID: googleOauthConfig.clientId,
    clientSecret: googleOauthConfig.clientSecret,
    callbackURL: `${serverConfig.serverUrl}${googleOauthConfig.callbackEndpoint}`,
    proxy: true,
  },
  async (_accessToken, _refreshToken, profile, done) => {
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
      const user = await createUserFromGoogleProfile(profile);

      done(null, user);
    } catch (error) {
      console.error("error with google user auth", error);
    }
  }
);

const createUserFromGoogleProfile = async (profile: any) => {
  const fileName = `${Date.now()}.png`;
  const username = profile.email.split("@")[0];

  const userDTO: CreateExternalUserDTO = {
    name: profile.displayName as string,
    email: profile.email as string,
    username: username || (profile.email as string),
    externalId: profile.id as string,
    picture: fileName,
  };

  const user = await usersService.createUser(userDTO);

  await storageService.saveExternalFile(
    profile.picture,
    USER_PICTURE_STORAGE_PATH,
    user._id,
    fileName
  );

  return user;
};

passport.use(googleAuth);
