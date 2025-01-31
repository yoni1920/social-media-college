import { Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Registration } from "./auth/components/register/Registration";
import { AuthRoute } from "./auth/components/routing/AuthRoute";
import { ProtectedRoute } from "./auth/components/routing/ProtectedRoute";
import { SignIn } from "./auth/components/sign-in/SignIn";
import { AuthProvider } from "./auth/providers/auth-provider";
import { Layout } from "./components/Layout";
import { RouteTab } from "./enums";
import { Home } from "./home/components/Home";
import { SavePostForm } from "./new-post/components/SavePostForm";
import { NotFound } from "./not-found/components/NotFound";
import { ProfilePage } from "./profile/components/ProfilePage";
import { UserProfile } from "./profile/components/UserProfile";
import { EditProfile } from "./profile/components/edit-profile/EditProfile";

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
                  <Route path={RouteTab.HOME} element={<Home />} />
                  <Route path={RouteTab.NEW_POST} element={<SavePostForm />} />
                  <Route path="/profile/:id?" element={<ProfilePage />} />
                  <Route
                    path={RouteTab.USER_PROFILE}
                    element={<UserProfile />}
                  />
                  <Route
                    path={RouteTab.EDIT_PROFILE}
                    element={<EditProfile />}
                  />
                </Route>
              </Route>

              <Route
                path="/"
                element={<Navigate to={RouteTab.HOME} replace />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </Router>
      </Stack>
    </LocalizationProvider>
  );
}

export default App;
