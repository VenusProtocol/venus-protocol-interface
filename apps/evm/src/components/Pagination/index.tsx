/** @jsxImportSource @emotion/react */
import Typography from '@mui/material/Typography';
import type { ReactElement } from 'react';

import { Button } from '@venusprotocol/ui';
import { Icon, type IconProps } from '../Icon';
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
  initialPageIndex,
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
    onChange: newPageIndex => {
      onChange(newPageIndex + (initialPageIndex || 0));
    },
    itemsPerPageCount,
  });

  const styles = useStyles();

  if (pagesCount <= 1) {
    return null;
  }

  const iconProps: IconProps = { name: 'arrowRight' };

  return (
    <div css={styles.root} className={className}>
      <Typography css={styles.itemsCountString} className="text-light-grey">
        {itemsCountString}
      </Typography>

      <div className="flex items-center gap-x-2">
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
    </div>
  );
};
