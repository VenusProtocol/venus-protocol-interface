import { type RefObject, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { PAGE_CONTAINER_ID } from 'constants/layout';
import { PAGE_PARAM_DEFAULT_KEY, PAGE_PARAM_DEFAULT_VALUE } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';

type PaginationProps = {
  itemsCount: number;
  onChange: (newPageIndex: number) => void;
  itemsPerPageCount?: number;
  paramKey?: string;
  scrollToRef?: RefObject<HTMLDivElement | null>;
};

export function usePagination({
  itemsCount,
  onChange,
  itemsPerPageCount = 10,
  paramKey = PAGE_PARAM_DEFAULT_KEY,
  scrollToRef,
}: PaginationProps) {
  const { t } = useTranslation();
  const scrollElem = document.getElementById(PAGE_CONTAINER_ID);

  const [searchParams, setSearchParams] = useSearchParams();

  const activePageIndex = useMemo(() => {
    const pageParam = searchParams.get(paramKey);
    return pageParam ? +pageParam - 1 : 0;
  }, [searchParams, paramKey]);

  const [pagesCount, setPagesCount] = useState(0);

  /* calculating items per page count */
  useEffect(() => {
    setPagesCount(Math.ceil(itemsCount / itemsPerPageCount));
  }, [itemsPerPageCount, itemsCount]);

  /* Fall back to the first page when the URL points beyond the available pages */
  useEffect(() => {
    if (pagesCount > 0 && activePageIndex > pagesCount - 1) {
      setSearchParams(
        currentSearchParams => ({
          ...Object.fromEntries(currentSearchParams),
          [paramKey]: String(PAGE_PARAM_DEFAULT_VALUE),
        }),
        { replace: true },
      );
    }
  }, [pagesCount, activePageIndex, paramKey, setSearchParams]);

  const isLastPage = activePageIndex === pagesCount - 1;
  const currentPageFirstIndex = activePageIndex * itemsPerPageCount;
  const currentPageLastIndex = isLastPage ? itemsCount : currentPageFirstIndex + itemsPerPageCount;
  const firstItemNumber = currentPageFirstIndex + 1;
  const isSingleItemOnPage = firstItemNumber === currentPageLastIndex;
  const itemsCountString = isSingleItemOnPage
    ? t('pagination.itemOf', { currentPageLastIndex, itemsCount })
    : t('pagination.itemsOf', { firstItemNumber, currentPageLastIndex, itemsCount });

  const handlePageChange = (pageIndex: number) => {
    onChange(pageIndex);

    if (scrollToRef?.current) {
      scrollToRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
      return;
    }

    scrollElem?.scrollTo({ behavior: 'instant', top: 0 });
  };

  return {
    pagesCount,
    activePageIndex,
    itemsCountString,
    goToPageByIndex: handlePageChange,
  };
}
