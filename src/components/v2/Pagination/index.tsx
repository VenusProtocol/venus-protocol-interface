/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '../Button';
import { Icon, IIconProps } from '../Icon';
import { useStyles } from './styles';

interface IPaginationProps {
  className?: string;
  activePageIndex: number;
  pagesCount: number;
  setCurrentPageIndex: (pageIndex: number) => void;
}

const PAGES_TO_SHOW_COUNT = 4;

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
        const iconProps: IIconProps = { size: '20px', name: 'arrowRight', color: 'inherit' };
        if (index === minPageIndexToShow) {
          return (
            <div css={classes.arrowButtonWrapper}>
              <Button
                variant="text"
                css={classes.button}
                key={page}
                onClick={() => setCurrentPageIndex(activePageIndex - 1)}
              >
                <Icon css={classes.iconReverted} {...iconProps} />
              </Button>
              <Typography css={classes.dots}>...</Typography>
            </div>
          );
        }

        if (index === maxPageIndexToShow) {
          return (
            <div css={classes.arrowButtonWrapper}>
              <Typography css={classes.dots}>...</Typography>
              <Button
                variant="text"
                css={classes.button}
                key={page}
                onClick={() => setCurrentPageIndex(activePageIndex + 1)}
              >
                <Icon {...iconProps} />
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
