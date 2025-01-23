import { useMemo } from "react";
import { RouteTab } from "../../enums";
import { matchRoutes, useLocation } from "react-router-dom";

export const useCurrentTab = () => {
  const location = useLocation();

  const routes = useMemo(
    () => Object.values(RouteTab).map((route) => ({ path: route })),
    []
  );

  const currentTab = useMemo((): RouteTab | null => {
    const result = matchRoutes(routes, location);

    if (!result) {
      return null;
    }

    const [{ route: targetRoute }] = result;
    const routeTab = Object.values(RouteTab).find(
      (route) => route === targetRoute.path
    );

    return routeTab ?? null;
  }, [routes, location]);

  return {
    currentTab,
  };
};
