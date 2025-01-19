import { useMemo } from "react";
import { RouteTab } from "../../enums";
import { matchRoutes, useLocation } from "react-router-dom";

export const useCurrentTab = () => {
  const location = useLocation();

  const routes = useMemo(
    () => Object.values(RouteTab).map((route) => ({ path: route })),
    []
  );

  const currentTab = useMemo((): RouteTab => {
    const result = matchRoutes(routes, location);

    if (!result) {
      return RouteTab.HOME;
    }

    const [{ route: targetRoute }] = result;
    const routeTab = Object.values(RouteTab).find(
      (route) => route === targetRoute.path
    );

    return routeTab ?? RouteTab.HOME;
  }, [routes, location]);

  return {
    currentTab,
  };
};
