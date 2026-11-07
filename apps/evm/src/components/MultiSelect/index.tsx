import { Button, cn } from '@venusprotocol/ui';

import { Dropdown } from '../Dropdown';
import { Icon } from '../Icon';

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
  size?: 'xs' | 'sm';
  className?: string;
  buttonClassName?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  renderCount,
  title,
  resetLabel,
  size = 'sm',
  className,
  buttonClassName,
}) => {
  const toggle = (optionValue: string) =>
    onChange(
      value.includes(optionValue) ? value.filter(v => v !== optionValue) : [...value, optionValue],
    );

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
        <div className="min-w-full">
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

          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className="hover:bg-surface-segment-hover active:bg-surface-segment-hover flex h-12 w-full cursor-pointer items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-b1r whitespace-nowrap text-primary">{option.label}</span>

              <Icon
                name={value.includes(option.value) ? 'checked' : 'checkboxBorder'}
                className="size-5 shrink-0"
              />
            </button>
          ))}
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
