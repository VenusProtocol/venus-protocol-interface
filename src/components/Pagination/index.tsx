/** @jsxImportSource @emotion/react */
import React, { ReactElement } from 'react';
import Typography from '@mui/material/Typography';
import { Button } from '../Button';
import { Icon, IIconProps } from '../Icon';
import { useStyles } from './styles';
import { usePagination } from './usePagination';

interface IPaginationButtonProps {
  className?: string;
  onClick: () => void;
  children: number | ReactElement;
}

const PaginationButton: React.FC<IPaginationButtonProps> = ({ className, onClick, children }) => {
  const styles = useStyles();
  return (
    <Button variant="text" css={styles.button} className={className} onClick={onClick}>
      {children}
    </Button>
  );
};

interface IPaginationProps {
  itemsCount: number;
  onChange: (newPageIndex: number) => void;
  initialPageIndex?: number;
  itemsPerPageCount?: number;
  className?: string;
}

export const Pagination = ({
  itemsCount,
  onChange,
  initialPageIndex,
  itemsPerPageCount,
  className,
}: IPaginationProps) => {
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
    initialPageIndex,
    itemsPerPageCount,
  });

  const styles = useStyles();

  if (pagesCount <= 1) {
    return null;
  }

  const iconProps: IIconProps = { name: 'arrowRight', color: 'inherit' };

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
