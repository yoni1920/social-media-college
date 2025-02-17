import { Button, Stack, Typography } from "@mui/material";
import { AppCard } from "../../components/AppCard";
import { AppTitleLogo } from "../../components/AppTitleLogo";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <AppCard>
      <Stack alignItems={"center"} my={4} gap={5}>
        <AppTitleLogo variant="h3" />
        <Stack alignItems={"center"} gap={1}>
          <Typography variant="h4">OOPS... Page Not Found</Typography>

          <Typography fontWeight={"light"} fontSize={"large"}>
            The page you are looking for does not exist
          </Typography>
        </Stack>

        <Link to="/">
          <Button
            startIcon={<HomeIcon />}
            variant="contained"
            sx={(theme) => ({
              background: theme.palette.gradient.main,
              paddingX: "1rem",
              paddingY: "0.6rem",
            })}>
            Go Home
          </Button>
        </Link>
      </Stack>
    </AppCard>
  );
};
