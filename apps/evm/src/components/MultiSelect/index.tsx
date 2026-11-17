import { Button, cn } from '@venusprotocol/ui';
import { useLayoutEffect, useRef, useState } from 'react';

import { useBreakpointUp } from 'hooks/responsive';
import { useTranslation } from 'libs/translations';
import { getPageContentTop } from 'utilities';

import { Dropdown } from '../Dropdown';
import { Icon } from '../Icon';
import { TextField } from '../TextField';

const MENU_VIEWPORT_MARGIN_PX = 16;
const MENU_MIN_HEIGHT_PX = 144;
const MENU_GAP_PX = 8;

// Search and scroll start above 6 options.
const MAX_VISIBLE_ROWS = 6;

export interface MultiSelectOption {
  value: string;
  label: React.ReactNode;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: React.ReactNode;
  renderCount: (count: number) => React.ReactNode;
  title: React.ReactNode;
  resetLabel: React.ReactNode;
  searchPlaceholder: string;
  noResultsLabel: React.ReactNode;
  size?: 'xs' | 'sm';
  className?: string;
  buttonClassName?: string;
}

// Starts-with matches first, then contains matches.
const filterOptions = (options: MultiSelectOption[], query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return options;
  }

  const getSearchText = (option: MultiSelectOption) =>
    (typeof option.label === 'string' ? option.label : option.value).toLowerCase();

  const startsWithQuery = options.filter(option =>
    getSearchText(option).startsWith(normalizedQuery),
  );
  const containsQuery = options.filter(
    option =>
      !getSearchText(option).startsWith(normalizedQuery) &&
      getSearchText(option).includes(normalizedQuery),
  );

  return [...startsWithQuery, ...containsQuery];
};

interface MultiSelectPanelProps
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

const MultiSelectPanel: React.FC<MultiSelectPanelProps> = ({
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
  const pendingScrollTopRef = useRef<number | null>(null);
  const scrollTopBeforeSearchRef = useRef(0);

  const isSearchEnabled = options.length > MAX_VISIBLE_ROWS;
  const visibleOptions = filterOptions(options, query);

  useLayoutEffect(() => {
    if (pendingScrollTopRef.current !== null && listRef.current) {
      listRef.current.scrollTop = pendingScrollTopRef.current;
      pendingScrollTopRef.current = null;
    }
  });

  const handleQueryChange = (newQuery: string) => {
    const currentScrollTop = listRef.current?.scrollTop ?? 0;

    if (!query && newQuery) {
      scrollTopBeforeSearchRef.current = currentScrollTop;
      pendingScrollTopRef.current = 0;
    } else if (query && !newQuery) {
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
            onClick={() => onChange([])}
            disabled={value.length === 0}
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
                    aria-label="Clear search"
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

      {visibleOptions.length === 0 && (
        <div className="flex flex-none flex-col items-center gap-3 px-4 py-6 text-center">
          <span className="text-b1r text-secondary">{noResultsLabel}</span>

          <Button
            size="sm"
            onClick={() => {
              handleQueryChange('');
              onChange([]);
            }}
          >
            {t('noResults.resetFilters')}
          </Button>
        </div>
      )}

      <div
        ref={listRef}
        onScroll={event => setIsScrolled(event.currentTarget.scrollTop > 0)}
        className={cn(
          'overscroll-contain',
          // Only long lists scroll inside the menu.
          isSearchEnabled && 'min-h-0 max-h-72 overflow-y-auto',
        )}
      >
        {visibleOptions.map(option => (
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
        ))}
      </div>
    </>
  );
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  renderCount,
  title,
  resetLabel,
  searchPlaceholder,
  noResultsLabel,
  size = 'sm',
  className,
  buttonClassName,
}) => {
  const fitMenuToViewport = (node: HTMLDivElement | null) => {
    const menu = node?.closest<HTMLElement>('.venus-multiselect-menu');

    if (!node || !menu) {
      return;
    }

    const spaceBelow =
      window.innerHeight - node.getBoundingClientRect().top - MENU_VIEWPORT_MARGIN_PX;
    const menuWrapper = menu.parentElement;
    const menuAnchor = menuWrapper?.parentElement;
    const trigger = menuAnchor?.parentElement;

    const fitBelow = () => {
      node.style.maxHeight = `${Math.max(spaceBelow, MENU_MIN_HEIGHT_PX)}px`;
    };

    if (spaceBelow >= MENU_MIN_HEIGHT_PX || !menuWrapper || !menuAnchor || !trigger) {
      fitBelow();
      return;
    }

    const triggerTop = trigger.getBoundingClientRect().top;
    const spaceAbove = triggerTop - getPageContentTop() - MENU_GAP_PX * 2;

    if (spaceAbove <= spaceBelow) {
      fitBelow();
      return;
    }

    menuWrapper.style.top = 'auto';
    menuWrapper.style.bottom = `${menuAnchor.getBoundingClientRect().top - triggerTop}px`;
    menuWrapper.style.paddingTop = '0';
    menuWrapper.style.paddingBottom = `${MENU_GAP_PX}px`;
    node.style.maxHeight = `${spaceAbove}px`;
  };

  let triggerLabel = placeholder;
  if (value.length === 1) {
    triggerLabel = options.find(option => option.value === value[0])?.label ?? placeholder;
  } else if (value.length > 1) {
    triggerLabel = renderCount(value.length);
  }

  return (
    <Dropdown
      className={className}
      menuPosition="right"
      // Clip the options to the menu's rounded corners, so the hover highlight of the last
      // option does not bleed past the border
      menuClassName="venus-multiselect-menu overflow-hidden"
      optionsDom={() => (
        <div ref={fitMenuToViewport} className="flex min-w-full flex-col overflow-y-auto">
          <MultiSelectPanel
            options={options}
            value={value}
            onChange={onChange}
            title={title}
            resetLabel={resetLabel}
            searchPlaceholder={searchPlaceholder}
            noResultsLabel={noResultsLabel}
          />
        </div>
      )}
    >
      {({ isDropdownOpen, handleToggleDropdown }) => (
        <Button
          onClick={handleToggleDropdown}
          contentClassName={cn(
            'text-b1r w-full justify-center group-hover/trigger:font-semibold',
            isDropdownOpen && 'font-semibold',
          )}
          className={cn(
            'group/trigger relative w-full rounded-lg border-select bg-input text-primary bg-linear-to-b from-surface-raised to-surface-raised shadow-none! backdrop-blur-none! backdrop-saturate-100 hover:border-select hover:bg-input active:bg-input',
            size === 'xs' ? 'h-10 px-3' : 'h-12 px-4',
            isDropdownOpen && 'border-brand hover:border-brand',
            value.length > 0 && 'border-brand',
            buttonClassName,
          )}
        >
          <span className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
            {triggerLabel}
          </span>

          <Icon
            name="chevronDown"
            className={cn('text-secondary ml-2 size-3 flex-none', isDropdownOpen && 'rotate-180')}
          />
        </Button>
      )}
    </Dropdown>
  );
};
