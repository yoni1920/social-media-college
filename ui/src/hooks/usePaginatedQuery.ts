import { useCallback, useEffect, useState } from "react";
import { type AxiosResponse } from "axios";

export const usePaginatedQuery = <T>(
  queryFn: (page: number) => Promise<AxiosResponse<T>>,
  initialPage = 0
) => {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await queryFn(page);
      setData(data);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
    return !isError;
  }, [queryFn]);

  const fetchNextPage = useCallback(async () => {
    if (await refresh()) {
      setPage((page) => page + 1);
    }
  }, [page, queryFn]);

  useEffect(() => {
    fetchNextPage();
  }, [queryFn]);

  return { data, isLoading, isError, fetchNextPage, refresh };
};
