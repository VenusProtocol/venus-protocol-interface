import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@venusprotocol/ui';
import { useTranslation } from 'libs/translations';
import { Icon, type IconProps } from '../Icon';
import { PaginationButton } from './PaginationButton';
import { usePagination } from './usePagination';

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
    <div
      className={cn(
        'my-5 flex flex-wrap items-center justify-center sm:flex-nowrap sm:justify-end',
        className,
      )}
    >
      <p className="m-0 mb-2 w-full whitespace-nowrap text-center text-base sm:mr-2 sm:mb-0 sm:w-auto sm:text-left">
        {itemsCountString}
      </p>

      {!isFirstPage && (
        <PaginationButton
          onClick={() => goToPageByIndex(0)}
          ariaLabel={t('pagination.goToFirstPage')}
        >
          <Icon className="size-6 text-inherit" name="doubleChevronLeft" />
        </PaginationButton>
      )}

      {!isFirstPage && (
        <PaginationButton
          onClick={() => goToPageByIndex(activePageIndex - 1)}
          ariaLabel={t('pagination.goToPreviousPage')}
        >
          <Icon className="size-6 rotate-180 text-inherit" {...iconProps} />
        </PaginationButton>
      )}

      <input
        className="mx-1 size-8 cursor-pointer rounded border border-dark-blue-hover bg-transparent p-0 text-center text-white transition-colors duration-300 selection:bg-blue hover:border-blue focus:border-blue focus:outline-none"
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
          <Icon className="size-6 text-inherit" {...iconProps} />
        </PaginationButton>
      )}

      {!isLastPage && (
        <PaginationButton
          onClick={() => goToPageByIndex(pagesCount - 1)}
          ariaLabel={t('pagination.goToLastPage')}
        >
          <Icon className="size-8 text-inherit" name="doubleChevronRight" />
        </PaginationButton>
      )}
    </div>
  );
};
