import { Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { SignIn } from "./auth/components/sign-in/SignIn";
import { Registration } from "./auth/components/register/Registration";
import { Home } from "./home/components/Home";
import { AuthProvider } from "./auth/providers/auth-provider";
import { ProtectedRoute } from "./auth/components/routing/ProtectedRoute";
import { Profile } from "./profile/components/Profile";
import { NewPost } from "./new-post/components/NewPost";
import { Layout } from "./components/Layout";
import { AuthRoute } from "./auth/components/routing/AuthRoute";
import { NotFound } from "./not-found/components/NotFound";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        width={"inherit"}
        height={"inherit"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Router>
          <AuthProvider>
            <Routes>
              <Route element={<AuthRoute />}>
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<SignIn />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/new-post" element={<NewPost />} />
                  <Route path="/profile/:id?" element={<Profile />} />
                </Route>
              </Route>

              <Route path="/" element={<Navigate to="/home" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </Stack>
    </LocalizationProvider>
  );
}

export default App;
