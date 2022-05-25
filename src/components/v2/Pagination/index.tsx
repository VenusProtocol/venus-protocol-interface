/** @jsxImportSource @emotion/react */
import React, { ReactElement } from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '../Button';
import { Icon, IIconProps } from '../Icon';
import { useStyles } from './styles';

interface IPaginationButtonProps {
  className?: string;
  onClick: () => void;
  dotsPosition?: 'before' | 'after';
  children: number | ReactElement;
}

const PaginationButton: React.FC<IPaginationButtonProps> = ({
  className,
  onClick,
  // dotsPosition,
  children,
}) => {
  const classes = useStyles();
  return (
    <div css={classes.arrowButtonWrapper}>
      {/* {dotsPosition === 'before' && <Typography css={classes.dots}>...</Typography>} */}
      <Button variant="text" css={[classes.button]} className={className} onClick={onClick}>
        {children}
      </Button>
      {/* {dotsPosition === 'after' && <Typography css={classes.dots}>...</Typography>} */}
    </div>
  );
};

interface IPaginationProps {
  pagesCount: number;
  activePageIndex: number;
  goToPageByIndex: (pageIndex: number) => void;
  itemsCountString?: string;
  className?: string;
}

const PAGES_TO_SHOW_COUNT = 4;

export const Pagination = ({
  pagesCount,
  activePageIndex,
  goToPageByIndex,
  itemsCountString,
  className,
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

  const iconProps: IIconProps = { size: '25', name: 'arrowRight', color: 'inherit' };

  return (
    <div css={[classes.root, className]}>
      {itemsCountString && (
        <Typography css={classes.itemsCountString}>{itemsCountString}</Typography>
      )}

      {pagesArray.map((page, index) => {
        if (index === maxPageIndexToShow) {
          return (
            <PaginationButton
              key={page}
              onClick={() => goToPageByIndex(activePageIndex + 1)}
              dotsPosition="before"
            >
              <Icon {...iconProps} />
            </PaginationButton>
          );
        }

        if (index === minPageIndexToShow) {
          return (
            <PaginationButton
              key={page}
              onClick={() => goToPageByIndex(activePageIndex - 1)}
              dotsPosition="after"
            >
              <Icon css={classes.iconReverted} {...iconProps} />
            </PaginationButton>
          );
        }

        if (index < minPageIndexToShow || index > maxPageIndexToShow) {
          return null;
        }

        return (
          <PaginationButton
            key={page}
            onClick={() => goToPageByIndex(index)}
            css={classes.getButtonStyles({ isActive: index === activePageIndex })}
          >
            {page}
          </PaginationButton>
        );
      })}
    </div>
  );
};
