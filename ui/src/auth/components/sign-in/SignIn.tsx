import { Divider, Link, Stack, Typography } from "@mui/material";
import { AppTitleLogo } from "../../../components/AppTitleLogo";
import { AppCard } from "../../../components/AppCard";
import { GoogleAuthButton } from "../GoogleAuthButton";
import { SignInForm } from "./SignInForm";

export const SignIn = () => {
  return (
    <AppCard>
      <Stack gap={3} my={4} alignItems={"center"}>
        <AppTitleLogo variant="h3" />

        <Typography
          textAlign={"center"}
          fontSize={"large"}
          fontWeight={"light"}>
          Sign in using social media to get quick access
        </Typography>

        <GoogleAuthButton />

        <Divider sx={{ width: "70%" }}>OR</Divider>

        <SignInForm />

        <Stack direction={"row"} alignItems={"center"} gap={0.5}>
          <Typography>Don't have an account yet?</Typography>
          <Link underline="hover" href="/#/register">
            <Typography>Sign up</Typography>
          </Link>
        </Stack>
      </Stack>
    </AppCard>
  );
};
