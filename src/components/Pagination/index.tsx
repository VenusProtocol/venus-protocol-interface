/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import React, { ReactElement } from 'react';

import { Button } from '../Button';
import { Icon, IconProps } from '../Icon';
import { useStyles } from './styles';
import { usePagination } from './usePagination';

interface PaginationButtonProps {
  className?: string;
  onClick: () => void;
  children: number | ReactElement;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({ className, onClick, children }) => {
  const styles = useStyles();
  return (
    <Button variant="text" css={styles.button} className={className} onClick={onClick}>
      {children}
    </Button>
  );
};

interface PaginationProps {
  itemsCount: number;
  onChange: (newPageIndex: number) => void;
  initialPageIndex?: number;
  itemsPerPageCount?: number;
  className?: string;
}

export const Pagination = ({
  itemsCount,
  onChange,
  itemsPerPageCount,
  className,
}: PaginationProps) => {
  const {
    pagesCount,
    activePageIndex,
    goToPageByIndex,
    itemsCountString,
    pagesArray,
    minPageIndexToShow,
    maxPageIndexToShow,
  } = usePagination({
    itemsCount,
    onChange,
    itemsPerPageCount,
  });

  const styles = useStyles();

  if (pagesCount <= 1) {
    return null;
  }

  const iconProps: IconProps = { name: 'arrowRight', color: 'inherit' };

  return (
    <div className={className} css={styles.root}>
      <Typography css={styles.itemsCountString}>{itemsCountString}</Typography>

      {pagesArray.map((page, index) => {
        if (index === maxPageIndexToShow) {
          return (
            <PaginationButton key={page} onClick={() => goToPageByIndex(activePageIndex + 1)}>
              <Icon css={styles.iconArrow} {...iconProps} />
            </PaginationButton>
          );
        }

        if (index === minPageIndexToShow) {
          return (
            <PaginationButton key={page} onClick={() => goToPageByIndex(activePageIndex - 1)}>
              <Icon css={[styles.iconArrow, styles.iconReverted]} {...iconProps} />
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
            css={styles.getButtonStyles({ isActive: index === activePageIndex })}
          >
            {page}
          </PaginationButton>
        );
      })}
    </div>
  );
};
