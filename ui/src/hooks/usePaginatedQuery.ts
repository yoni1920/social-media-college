import { useCallback, useEffect, useState } from "react";
import { type AxiosResponse } from "axios";

interface PaginationResult<T> {
  docs: T[];
  page: number;
  totalPages: number;
}
export const usePaginatedQuery = <T>(
  queryFn: (page: number) => Promise<AxiosResponse<PaginationResult<T>>>,
  initialPage = 0
) => {
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<T[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await queryFn(page);

      setData(data.docs);
      setTotalPages(data.totalPages);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, page]);

  // TODO: implement pages
  const fetchNextPage = useCallback(
    async (newPage?: number) => {
      await refresh();

      if (!isError && data?.length) {
        setPage((page) => (newPage ? newPage : page + 1));
      }
    },
    [refresh]
  );

  useEffect(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return { data, isLoading, isError, fetchNextPage, refresh, page, totalPages };
};
