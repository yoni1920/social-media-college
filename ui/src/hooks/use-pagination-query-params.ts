import useQueryParams from "@scaleway/use-query-params";
import { useCallback, useMemo } from "react";
import { PageData } from "./use-paginated-query";

export const usePaginationQueryParams = () => {
  const { queryParams, setQueryParams } = useQueryParams();

  const pageData: PageData = useMemo(
    () => ({
      page: Number(queryParams.page) || 1,
      totalPages: Number(queryParams.totalPages) || 1,
    }),
    [queryParams.page, queryParams.totalPages]
  );

  const setPage = useCallback((page: number) => {
    setQueryParams({ page });
  }, []);
  const setPageData = useCallback((pageData: PageData) => {
    setQueryParams({ ...pageData });
  }, []);

  return { pageData, setPage, setPageData };
};
