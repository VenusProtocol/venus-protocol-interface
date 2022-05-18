import { useEffect, useState } from 'react';

type IPaginationProps<Row> = {
  data: Row[];
  rowsPerPageCount?: number;
};

export function usePagination<Row>({ data, rowsPerPageCount = 10 }: IPaginationProps<Row>) {
  const [currentPageData, setCurrentPageData] = useState<Row[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);

  /* calculating rows per page count */
  useEffect(() => {
    setPagesCount(Math.ceil(data.length / rowsPerPageCount));
  }, [rowsPerPageCount]);

  // const isFirstPage = currentPageIndex === 0;
  const isLastPage = currentPageIndex === pagesCount - 1;
  const currentPageFirstIndex = currentPageIndex * rowsPerPageCount;
  const currentPageLastIndex = isLastPage ? data.length : currentPageFirstIndex + rowsPerPageCount;
  const itemsCountString = `${currentPageFirstIndex + 1} - ${currentPageLastIndex} items of ${
    data.length
  }`;

  /* setting data for selected page */
  useEffect(() => {
    const newPageData = data.slice(currentPageFirstIndex, currentPageLastIndex);
    setCurrentPageData(newPageData);
  }, [currentPageIndex, rowsPerPageCount]);

  return {
    pagesCount,
    currentPageIndex,
    setCurrentPageIndex,
    currentPageData,
    itemsCountString,
  };
}
