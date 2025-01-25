import { useCallback, useEffect, useRef, useState } from "react";
import { type AxiosResponse } from "axios";

export const usePaginatedQuery = <T>(
  queryFn: (page: number) => Promise<AxiosResponse<T>>,
  initialPage = 0
) => {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchNextPage = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const { data } = await queryFn(nextPage);
      setData(data);
      setPage(nextPage);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [page, queryFn]);

  useEffect(() => {
    fetchNextPage();
  }, [queryFn]);

  return { data, isLoading, isError, fetchNextPage };
};
