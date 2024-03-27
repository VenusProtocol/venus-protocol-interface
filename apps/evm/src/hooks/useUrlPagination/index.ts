import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export type UseUrlPaginationOutput = {
  currentPage: number;
  setCurrentPage: (newPageIndex: number) => void;
};

export const PAGE_PARAM_DEFAULT_VALUE = 1;
export const PAGE_PARAM_KEY = 'page';

export const useUrlPagination = (): UseUrlPaginationOutput => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = searchParams.get(PAGE_PARAM_KEY) ?? undefined;

  const setPageIndex = useCallback(
    (newPageIndex: string | number) =>
      setSearchParams(
        currentSearchParams => ({
          ...Object.fromEntries(currentSearchParams),
          [PAGE_PARAM_KEY]: String(newPageIndex),
        }),
        {
          replace: true,
        },
      ),
    [setSearchParams],
  );

  useEffect(() => {
    // Add page param to URL if none has been set
    if (!pageIndex) {
      // Note: although the pagination starts from 0, we make it start from 1 in the
      // URL to make it more user-friendly. This is something we need to account for
      // when updating the page search param
      setPageIndex(PAGE_PARAM_DEFAULT_VALUE);
    }
  }, [pageIndex, setPageIndex]);

  const currentPage = useMemo(() => (pageIndex ? +pageIndex - 1 : 0), [pageIndex]);

  const setCurrentPage = useCallback(
    (newPageIndex: number) => setPageIndex(newPageIndex + 1),
    [setPageIndex],
  );

  return { currentPage, setCurrentPage };
};
