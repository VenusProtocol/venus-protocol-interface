import { cn } from '@venusprotocol/ui';
import { useLayoutEffect, useRef, useState } from 'react';

import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';

import { Icon } from '../../Icon';
import { TextField } from '../../TextField';
import { MAX_VISIBLE_ROWS } from '../constants';
import { filterOptions } from '../filterOptions';
import type { MultiSelectProps } from '../types';

export interface MultiSelectPanelProps
  extends Pick<
    MultiSelectProps,
    | 'options'
    | 'value'
    | 'onChange'
    | 'title'
    | 'resetLabel'
    | 'searchPlaceholder'
    | 'noResultsLabel'
  > {}

export const MultiSelectPanel: React.FC<MultiSelectPanelProps> = ({
  options,
  value,
  onChange,
  title,
  resetLabel,
  searchPlaceholder,
  noResultsLabel,
}) => {
  const { t } = useTranslation();
  const isMdOrUp = useBreakpointUp('md');
  const [query, setQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const pendingScrollTopRef = useRef<number | undefined>(undefined);
  const scrollTopBeforeSearchRef = useRef(0);

  const isSearchEnabled = options.length > MAX_VISIBLE_ROWS;
  const visibleOptions = filterOptions(options, query);

  useLayoutEffect(() => {
    if (pendingScrollTopRef.current !== undefined && listRef.current) {
      listRef.current.scrollTop = pendingScrollTopRef.current;
      pendingScrollTopRef.current = undefined;
    }
  });

  const handleQueryChange = (newQuery: string) => {
    if (newQuery) {
      if (!query) {
        scrollTopBeforeSearchRef.current = listRef.current?.scrollTop ?? 0;
      }

      // The results change with every keystroke, so show them from the top.
      pendingScrollTopRef.current = 0;
    } else if (query) {
      // Restore the scroll position after clearing.
      pendingScrollTopRef.current = scrollTopBeforeSearchRef.current;
    }

    setQuery(newQuery);
  };

  const toggle = (optionValue: string) =>
    onChange(
      value.includes(optionValue) ? value.filter(v => v !== optionValue) : [...value, optionValue],
    );

  return (
    <>
      <div className="flex-none">
        <div className="flex h-12 items-center justify-between gap-3 px-4 py-3">
          <span className="text-b1r truncate text-primary">{title}</span>

          <button
            type="button"
            onClick={() => {
              handleQueryChange('');
              onChange([]);
            }}
            disabled={!query && value.length === 0}
            className="text-brand text-b1r shrink-0 cursor-pointer disabled:cursor-default disabled:opacity-50"
          >
            {resetLabel}
          </button>
        </div>

        {isSearchEnabled && (
          <div className="px-4 pb-3">
            <TextField
              size="xs"
              value={query}
              onChange={event => handleQueryChange(event.currentTarget.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              autoFocus={isMdOrUp}
              leftIconSrc="magnifier"
              inputContainerClassName="px-3"
              rightAdornment={
                query ? (
                  <button
                    type="button"
                    onClick={() => handleQueryChange('')}
                    aria-label={t('multiSelect.clearSearch')}
                    className="text-secondary hover:text-primary flex size-5 cursor-pointer items-center justify-center"
                  >
                    <Icon name="close" className="size-3" />
                  </button>
                ) : undefined
              }
              className="w-full"
            />
          </div>
        )}
      </div>

      {isSearchEnabled && isScrolled && <div className="border-subtle flex-none border-b" />}

      <div
        ref={listRef}
        onScroll={event => setIsScrolled(event.currentTarget.scrollTop > 0)}
        className={cn(
          'overscroll-contain',
          // Fixed height, so the menu keeps its size while the results change.
          isSearchEnabled && 'min-h-0 h-72 overflow-y-auto',
        )}
      >
        {visibleOptions.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-6 text-center">
            <span className="text-b1r text-secondary">{noResultsLabel}</span>
          </div>
        ) : (
          visibleOptions.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className="hover:bg-surface-dropdown-item-hover active:bg-surface-dropdown-item-hover flex h-12 w-full cursor-pointer items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-b1r whitespace-nowrap text-primary">{option.label}</span>

              <Icon
                name={value.includes(option.value) ? 'checked' : 'checkboxBorder'}
                className="size-5 shrink-0"
              />
            </button>
          ))
        )}
      </div>
    </>
  );
};
