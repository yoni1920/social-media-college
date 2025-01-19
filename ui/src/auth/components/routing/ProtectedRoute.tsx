import { Navigate, Outlet } from "react-router-dom";
import { GradientCircularProgress } from "../../../components/GradientLoader";
import { useAuth } from "../../hooks/use-auth";

export const ProtectedRoute = () => {
  const { user, isLoadingUserAuth } = useAuth();

  return isLoadingUserAuth ? (
    <GradientCircularProgress />
  ) : user ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} />
  );
};
