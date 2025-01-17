import { Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SignIn } from "./auth/components/SignIn";
import { Registration } from "./auth/components/Registration";
import { PostFeed } from "./home/components/PostFeed";
import { AuthProvider } from "./auth/providers/auth-provider";
import { ProtectedRoute } from "./auth/components/ProtectedRoute";

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
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <PostFeed />
                  </ProtectedRoute>
                }
              />
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<SignIn />} />
            </Routes>
          </AuthProvider>
        </Router>
      </Stack>
    </LocalizationProvider>
  );
}

export default App;
