import { Stack } from "@mui/material";
import { Authentication } from "./auth/components/Authentication";
import { useState } from "react";
import { PostFeed } from "./home/components/PostFeed";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        width={"inherit"}
        height={"inherit"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {accessToken ? <PostFeed /> : <Authentication />}
      </Stack>
    </LocalizationProvider>
  );
}

export default App;
