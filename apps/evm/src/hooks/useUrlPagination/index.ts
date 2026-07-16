import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';

export type UseUrlPaginationOutput = {
  currentPage: number;
  setCurrentPage: (newPageIndex: number) => void;
};

export const PAGE_PARAM_DEFAULT_VALUE = 1;
export const PAGE_PARAM_DEFAULT_KEY = 'page';

export interface UseUrlPaginationInput {
  // Search param key holding the active page, so several tables can paginate independently
  paramKey?: string;
}

export const useUrlPagination = ({
  paramKey = PAGE_PARAM_DEFAULT_KEY,
}: UseUrlPaginationInput = {}): UseUrlPaginationOutput => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageIndex = searchParams.get(paramKey) ?? undefined;

  const setPageIndex = useCallback(
    (newPageIndex: string | number, options?: { replace?: boolean }) =>
      setSearchParams(
        currentSearchParams => ({
          ...Object.fromEntries(currentSearchParams),
          [paramKey]: String(newPageIndex),
        }),
        options,
      ),
    [setSearchParams, paramKey],
  );

  // The URL page is 1-based and user-editable, so we guard against the values that
  // don't depend on the total count (missing, non-numeric, non-integer, below 1).
  // The upper bound (page above the total) is handled where the page count is known.
  const parsedPage = pageIndex === undefined ? undefined : Number(pageIndex);
  const isValidPage =
    parsedPage !== undefined &&
    Number.isInteger(parsedPage) &&
    parsedPage >= PAGE_PARAM_DEFAULT_VALUE;

  useEffect(() => {
    // Fall back to the first page when the param is missing or invalid
    if (!isValidPage) {
      // Note: although the pagination starts from 0, we make it start from 1 in the
      // URL to make it more user-friendly. This is something we need to account for
      // when updating the page search param
      setPageIndex(PAGE_PARAM_DEFAULT_VALUE, { replace: true });
    }
  }, [isValidPage, setPageIndex]);

  const currentPage = useMemo(
    () => (isValidPage && parsedPage !== undefined ? parsedPage - 1 : 0),
    [isValidPage, parsedPage],
  );

  const setCurrentPage = useCallback(
    (newPageIndex: number) => setPageIndex(newPageIndex + 1),
    [setPageIndex],
  );

  return { currentPage, setCurrentPage };
};
