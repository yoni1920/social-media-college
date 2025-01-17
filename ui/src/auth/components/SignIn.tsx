import { Divider, Link, Stack, Typography } from "@mui/material";
import { AppTitleLogo } from "../../components/AppTitleLogo";
import { AuthCard } from "./AuthCard";
import { GoogleAuthButton } from "./GoogleAuthButton";
import { SignInForm } from "./SignInForm";
import { useAuth } from "../hooks/use-auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const SignIn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <AuthCard>
      <Stack gap={3} my={4} alignItems={"center"}>
        <AppTitleLogo />

        <Typography
          textAlign={"center"}
          fontSize={"large"}
          fontWeight={"light"}
        >
          Sign in using social media to get quick access
        </Typography>

        <GoogleAuthButton />

        <Divider sx={{ width: "70%" }}>OR</Divider>

        <SignInForm />

        <Stack direction={"row"} alignItems={"center"} gap={0.5}>
          <Typography>Don't have an account yet?</Typography>
          <Link underline="hover" href="/registration">
            <Typography>Sign up</Typography>
          </Link>
        </Stack>
      </Stack>
    </AuthCard>
  );
};
