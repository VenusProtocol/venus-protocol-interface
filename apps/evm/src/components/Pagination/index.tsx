import Typography from '@mui/material/Typography';
import type { ReactElement, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

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
  const { pagesCount, activePageIndex, goToPageByIndex, itemsCountString } = usePagination({
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

  const currentPage = activePageIndex + 1;
  const [inputValue, setInputValue] = useState(String(currentPage));
  const isCancellingRef = useRef(false);

  useEffect(() => {
    setInputValue(String(currentPage));
  }, [currentPage]);

  if (pagesCount <= 1) {
    return null;
  }

  const iconProps: IconProps = { name: 'arrowRight' };

  const isFirstPage = activePageIndex === 0;
  const isLastPage = activePageIndex === pagesCount - 1;

  const commitInput = () => {
    if (isCancellingRef.current) {
      isCancellingRef.current = false;
      setInputValue(String(currentPage));
      return;
    }

    const parsedPage = Number(inputValue);
    if (inputValue === '' || Number.isNaN(parsedPage)) {
      setInputValue(String(currentPage));
      return;
    }

    const targetPage = Math.min(Math.max(parsedPage, 1), pagesCount);
    setInputValue(String(targetPage));

    if (targetPage !== currentPage) {
      goToPageByIndex(targetPage - 1);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = event.target.value.replace(/\D/g, '');
    if (digitsOnly === '') {
      setInputValue('');
      return;
    }

    setInputValue(String(Math.min(Number(digitsOnly), pagesCount)));
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      isCancellingRef.current = true;
      event.currentTarget.blur();
    }
  };

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

      {!isFirstPage && (
        <PaginationButton
          onClick={() => goToPageByIndex(activePageIndex - 1)}
          ariaLabel={t('pagination.goToPreviousPage')}
        >
          <Icon css={[styles.iconArrow, styles.iconReverted]} {...iconProps} />
        </PaginationButton>
      )}

      <input
        css={styles.input}
        value={inputValue}
        inputMode="numeric"
        aria-label={t('pagination.currentPage')}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onFocus={event => event.target.select()}
        onBlur={commitInput}
      />

      {!isLastPage && (
        <PaginationButton
          onClick={() => goToPageByIndex(activePageIndex + 1)}
          ariaLabel={t('pagination.goToNextPage')}
        >
          <Icon css={styles.iconArrow} {...iconProps} />
        </PaginationButton>
      )}

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
