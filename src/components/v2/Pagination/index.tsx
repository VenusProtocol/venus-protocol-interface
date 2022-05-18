/** @jsxImportSource @emotion/react */
import React from 'react';
import { Button } from '../Button';
import { useStyles } from './styles';

interface IPaginationProps {
  className?: string;
  activePageIndex: number;
  pagesCount: number;
  setCurrentPageIndex: (pageIndex: number) => void;
}

/** This task is about creating a pagination component that will have the next behavior:
 - if there's 3 or less than 3 pages to handle in total, all page numbers should be displayed and the three dots should not display
 - the component should accept an optional initialPage  prop (defaulting to 1 ) which will define what page will be selected on mount
 - when pressing on the right arrow, the next page should get selected
 - when pressing on the left arrow, the previous page should get selected
 - if the first page is selected, no left arrow or dots should display
 - if the second page is selected, no left arrow should display
 - if the last page is selected, no right arrow or three dots should display
 - if the second to last page is selected, no right arrow should display
 - if any other page is selected, the left and right arrows as well as the three dots should display (as per designs)
 * */

const PAGES_TO_SHOW_COUNT = 3;

export const Pagination = ({
  className,
  activePageIndex,
  pagesCount,
  setCurrentPageIndex,
}: IPaginationProps) => {
  const classes = useStyles();

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

  if (pagesCount <= 1) {
    return null;
  }

  return (
    <div css={[classes.root, className]}>
      {pagesArray.map((page, index) => {
        if (index === minPageIndexToShow) {
          return (
            <div css={classes.arrowButtonWrapper}>
              <Button
                variant="text"
                css={classes.button}
                key={page}
                onClick={() => setCurrentPageIndex(activePageIndex - 1)}
              >
                {'<'}
              </Button>
              ...
            </div>
          );
        }

        if (index === maxPageIndexToShow) {
          return (
            <div css={classes.arrowButtonWrapper}>
              ...
              <Button
                variant="text"
                css={classes.button}
                key={page}
                onClick={() => setCurrentPageIndex(activePageIndex + 1)}
              >
                {'>'}
              </Button>
            </div>
          );
        }

        if (index < minPageIndexToShow || index > maxPageIndexToShow) {
          return null;
        }

        return (
          <Button
            variant="text"
            css={[classes.button, classes.getButtonStyles({ isActive: index === activePageIndex })]}
            key={page}
            onClick={() => setCurrentPageIndex(index)}
          >
            {page}
          </Button>
        );
      })}
    </div>
  );
};
