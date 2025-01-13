import { Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SignIn } from "./auth/components/SignIn";
import { Registration } from "./auth/components/Registration";
import { PostFeed } from "./home/components/PostFeed";

function App() {
  // const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        width={"inherit"}
        height={"inherit"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Router>
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/home" element={<PostFeed />} />
          </Routes>
        </Router>
        {/* {accessToken ? <PostFeed /> : <Authentication />} */}
      </Stack>
    </LocalizationProvider>
  );
}

export default App;
