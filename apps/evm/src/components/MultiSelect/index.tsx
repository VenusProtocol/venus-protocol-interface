import { Button, cn } from '@venusprotocol/ui';

import { Dropdown } from '../Dropdown';
import { Icon } from '../Icon';

const MENU_VIEWPORT_MARGIN_PX = 16;
const MENU_MIN_HEIGHT_PX = 144;
const MENU_GAP_PX = 8;

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

    if (spaceBelow < MENU_MIN_HEIGHT_PX && menuWrapper && menuAnchor && trigger) {
      const triggerTop = trigger.getBoundingClientRect().top;
      const spaceAbove = triggerTop - MENU_VIEWPORT_MARGIN_PX - MENU_GAP_PX;

      if (spaceAbove > spaceBelow) {
        menuWrapper.style.top = 'auto';
        menuWrapper.style.bottom = `${menuAnchor.getBoundingClientRect().top - triggerTop}px`;
        menuWrapper.style.paddingTop = '0';
        menuWrapper.style.paddingBottom = `${MENU_GAP_PX}px`;
        node.style.maxHeight = `${spaceAbove}px`;
        return;
      }
    }

    node.style.maxHeight = `${Math.max(spaceBelow, MENU_MIN_HEIGHT_PX)}px`;
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
        <div ref={fitMenuToViewport} className="min-w-full overflow-y-auto">
          <div className="flex h-12 items-center justify-between gap-3 px-4 py-3">
            <span className="text-b1r truncate text-white">{title}</span>

            <button
              type="button"
              onClick={() => onChange([])}
              disabled={value.length === 0}
              className="text-blue text-b1r shrink-0 cursor-pointer disabled:cursor-default disabled:opacity-50"
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
              <span className="text-b1r whitespace-nowrap text-white">{option.label}</span>

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
            'group/trigger relative w-full rounded-lg border-transparent bg-background-active bg-linear-to-b from-surface-raised to-surface-raised shadow-none! backdrop-blur-none! backdrop-saturate-100 hover:border-transparent hover:bg-background-active active:bg-background-active',
            size === 'xs' ? 'h-10 px-3' : 'h-12 px-4',
            isDropdownOpen && 'border-blue hover:border-blue',
            value.length > 0 && 'border-blue',
            buttonClassName,
          )}
        >
          <span className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
            {triggerLabel}
          </span>

          <Icon
            name="chevronDown"
            className={cn('text-grey ml-2 size-3 flex-none', isDropdownOpen && 'rotate-180')}
          />
        </Button>
      )}
    </Dropdown>
  );
};
