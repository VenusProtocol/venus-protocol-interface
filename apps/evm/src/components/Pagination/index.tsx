import Typography from '@mui/material/Typography';
import type { ReactElement, RefObject } from 'react';

import { Button } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import { Icon, type IconProps } from '../Icon';
import { useStyles } from './styles';
import { usePagination } from './usePagination';

interface PaginationButtonProps {
  className?: string;
  onClick: () => void;
  children: number | ReactElement;
  ariaLabel?: string;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  className,
  onClick,
  children,
  ariaLabel,
}) => {
  const styles = useStyles();
  return (
    <Button
      variant="text"
      css={styles.button}
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </Button>
  );
};

interface PaginationProps {
  itemsCount: number;
  onChange: (newPageIndex: number) => void;
  initialPageIndex?: number;
  itemsPerPageCount?: number;
  paramKey?: string;
  scrollToRef?: RefObject<HTMLDivElement | null>;
  className?: string;
}

export const Pagination = ({
  itemsCount,
  onChange,
  initialPageIndex,
  itemsPerPageCount,
  paramKey,
  scrollToRef,
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
    paramKey,
    scrollToRef,
  });

  const styles = useStyles();
  const { t } = useTranslation();

  if (pagesCount <= 1) {
    return null;
  }

  const iconProps: IconProps = { name: 'arrowRight' };

  const isFirstPage = activePageIndex === 0;
  const isLastPage = activePageIndex === pagesCount - 1;

  return (
    <div className={className} css={styles.root}>
      <Typography css={styles.itemsCountString}>{itemsCountString}</Typography>

      {!isFirstPage && (
        <PaginationButton
          onClick={() => goToPageByIndex(0)}
          ariaLabel={t('pagination.goToFirstPage')}
        >
          <Icon css={styles.iconArrow} name="doubleChevronLeft" />
        </PaginationButton>
      )}

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

      {!isLastPage && (
        <PaginationButton
          onClick={() => goToPageByIndex(pagesCount - 1)}
          ariaLabel={t('pagination.goToLastPage')}
        >
          <Icon css={styles.iconArrow} name="doubleChevronRight" />
        </PaginationButton>
      )}
    </div>
  );
};
