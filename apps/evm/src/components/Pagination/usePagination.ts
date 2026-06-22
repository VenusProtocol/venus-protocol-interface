import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { PAGE_CONTAINER_ID } from 'constants/layout';
import { PAGE_PARAM_DEFAULT_KEY } from 'hooks/useUrlPagination';
import { useTranslation } from 'libs/translations';

type PaginationProps = {
  itemsCount: number;
  onChange: (newPageIndex: number) => void;
  itemsPerPageCount?: number;
  // Search param key holding the active page, so several tables can paginate independently
  paramKey?: string;
};

const PAGES_TO_SHOW_COUNT = 4;

export function usePagination({
  itemsCount,
  onChange,
  itemsPerPageCount = 10,
  paramKey = PAGE_PARAM_DEFAULT_KEY,
}: PaginationProps) {
  const { t } = useTranslation();
  const scrollElem = document.getElementById(PAGE_CONTAINER_ID);

  const [searchParams] = useSearchParams();

  const activePageIndex = useMemo(() => {
    const pageParam = searchParams.get(paramKey);
    return pageParam ? +pageParam - 1 : 0;
  }, [searchParams, paramKey]);

  const [pagesCount, setPagesCount] = useState(0);

  /* calculating items per page count */
  useEffect(() => {
    setPagesCount(Math.ceil(itemsCount / itemsPerPageCount));
  }, [itemsPerPageCount, itemsCount]);

  const isLastPage = activePageIndex === pagesCount - 1;
  const currentPageFirstIndex = activePageIndex * itemsPerPageCount;
  const currentPageLastIndex = isLastPage ? itemsCount : currentPageFirstIndex + itemsPerPageCount;
  const firstItemNumber = currentPageFirstIndex + 1;
  const isSingleItemOnPage = firstItemNumber === currentPageLastIndex;
  const itemsCountString = isSingleItemOnPage
    ? t('pagination.itemOf', { currentPageLastIndex, itemsCount })
    : t('pagination.itemsOf', { firstItemNumber, currentPageLastIndex, itemsCount });

  /* creating pages array */
  const pagesArray = Array.from({ length: pagesCount }, (_, i) => i + 1);

  const halfOfPagesCount = Math.ceil(PAGES_TO_SHOW_COUNT / 2);
  const lastPageIndex = pagesCount - 1;
  const isActivePageInEnd = activePageIndex > lastPageIndex - halfOfPagesCount;
  const isActivePageInStart = activePageIndex < halfOfPagesCount;

  const minPageIndexToShow = isActivePageInEnd
    ? lastPageIndex - PAGES_TO_SHOW_COUNT
    : activePageIndex - halfOfPagesCount;

  const maxPageIndexToShow = isActivePageInStart
    ? PAGES_TO_SHOW_COUNT
    : activePageIndex + halfOfPagesCount;

  const handlePageChange = (pageIndex: number) => {
    onChange(pageIndex);

    scrollElem?.scrollTo({ behavior: 'instant', top: 0 });
  };

  return {
    pagesCount,
    activePageIndex,
    itemsCountString,
    goToPageByIndex: handlePageChange,
    pagesArray,
    minPageIndexToShow,
    maxPageIndexToShow,
  };
}
