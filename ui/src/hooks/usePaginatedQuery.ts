import { useCallback, useEffect, useState } from "react";
import { type AxiosResponse } from "axios";

interface PaginationResult<T> {
  docs: T[];
  page: number;
  totalPages: number;
}
export const usePaginatedQuery = <T>(
  queryFn: (page: number) => Promise<AxiosResponse<PaginationResult<T>>>,
  initialPage = 1
) => {
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialPage);
  const [data, setData] = useState<T[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await queryFn(page - 1);

      setData(data.docs);
      setTotalPages(data.totalPages);
    } catch (error) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [queryFn, page]);

  useEffect(() => {
    refresh();
  }, [page]);

  return { data, isLoading, isError, setPage, refresh, page, totalPages };
};
