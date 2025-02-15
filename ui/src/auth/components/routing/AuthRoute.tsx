import { Navigate, Outlet } from "react-router-dom";
import { GradientCircularProgress } from "../../../components/GradientCircularProgress";
import { useAuth } from "../../hooks/use-auth";

export const AuthRoute = () => {
  const { user, isLoadingUserAuth } = useAuth();

  return isLoadingUserAuth ? (
    <GradientCircularProgress />
  ) : user ? (
    <Navigate to={"/"} />
  ) : (
    <Outlet />
  );
};
