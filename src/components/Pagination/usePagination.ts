import { useEffect, useState } from 'react';
import { useTranslation } from 'translation';

type PaginationProps = {
  itemsCount: number;
  onChange: (newPageIndex: number) => void;
  initialPageIndex?: number;
  itemsPerPageCount?: number;
};

const PAGES_TO_SHOW_COUNT = 4;

const getInitialPageIndex = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const pageParam = searchParams.get('page');
  const initialPageIndex = pageParam ? +pageParam - 1 : 0;
  return initialPageIndex;
};

export function usePagination({ itemsCount, onChange, itemsPerPageCount = 10 }: PaginationProps) {
  const { t } = useTranslation();

  const [activePageIndex, setActivePageIndex] = useState(getInitialPageIndex());
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
    setActivePageIndex(pageIndex);
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
