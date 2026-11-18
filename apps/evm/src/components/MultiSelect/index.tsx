import { Button, cn } from '@venusprotocol/ui';

import { Dropdown } from '../Dropdown';
import { Icon } from '../Icon';
import { FittedMenu } from './FittedMenu';
import { MultiSelectPanel } from './MultiSelectPanel';
import { MAX_VISIBLE_ROWS } from './constants';
import type { MultiSelectProps } from './types';

export * from './types';

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
  const isSearchEnabled = options.length > MAX_VISIBLE_ROWS;

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
        <FittedMenu
          // Wide enough for the search placeholder to show in full.
          className={cn(
            'flex flex-col overflow-y-auto',
            isSearchEnabled ? 'min-w-[max(100%,15rem)]' : 'min-w-full',
          )}
        >
          <MultiSelectPanel
            options={options}
            value={value}
            onChange={onChange}
            title={title}
            resetLabel={resetLabel}
            searchPlaceholder={searchPlaceholder}
            noResultsLabel={noResultsLabel}
          />
        </FittedMenu>
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
