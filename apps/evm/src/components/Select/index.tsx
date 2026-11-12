import { Button, cn } from '@venusprotocol/ui';
import { forwardRef, useCallback, useMemo } from 'react';

import { Dropdown } from '../Dropdown';
import { Icon } from '../Icon';
import { renderLabel } from './renderLabel';
import type { SelectProps } from './types';

export * from './types';

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  <TValue extends string | number = string | number>(
    {
      className,
      dropdownClassName,
      buttonClassName,
      options,
      optionClassName = 'px-4 h-12',
      value,
      onChange,
      size = 'medium',
      variant,
      disabled = false,
      modalPortalContainer,
      label,
      placeLabelToLeft,
      menuTitle,
      menuPosition,
      triggerOnHover,
      wrapLabels = false,
      ...otherProps
    }: SelectProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const selectedOption = options.find(option => option.value === value);

    const buttonSizeClasses = useMemo(() => {
      if (size === 'large') {
        return cn('px-4 h-14');
      }

      if (size === 'medium') {
        return cn('px-4 h-12');
      }

      return cn('px-3 h-10');
    }, [size]);

    const getVariantClasses = ({
      variant,
      isDropdownOpen,
    }: {
      variant: SelectProps['variant'];
      isDropdownOpen: boolean;
    }) => {
      switch (variant) {
        case 'secondary':
          return cn(
            'border-lightGrey bg-lightGrey hover:border-blue hover:bg-lightGrey active:border-blue active:bg-lightGrey',
            isDropdownOpen && 'border-blue hover:border-blue',
          );
        case 'tertiary':
          return cn(
            'border-transparent bg-cards hover:bg-cards hover:border-white active:bg-cards active:border-blue',
            isDropdownOpen && 'border-blue hover:border-blue',
          );
        case 'quaternary':
          return cn(
            'border-transparent bg-lightGrey rounded-xl hover:bg-lightGrey hover:border-grey active:bg-lightGrey active:border-blue',
            isDropdownOpen && 'border-blue bg-lightGrey hover:border-blue',
          );
        // primary
        default:
          return cn(
            'rounded-lg border-transparent bg-background-active bg-linear-to-b from-surface-raised to-surface-raised shadow-none! backdrop-blur-none! backdrop-saturate-100 hover:border-transparent hover:bg-background-active active:bg-background-active',
            isDropdownOpen && 'border-blue hover:border-blue',
          );
      }
    };

    const optionsDom = useCallback(
      ({ setIsDropdownOpen }: { setIsDropdownOpen: (v: boolean) => void }) => {
        const handleChange = (newValue: typeof value) => {
          onChange(newValue);
          setIsDropdownOpen(false);
        };
        return (
          <div className={dropdownClassName}>
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => handleChange(option.value)}
                type="button"
                className={cn(
                  'hover:bg-surface-dropdown-item-hover active:bg-surface-dropdown-item-hover flex min-w-full items-center justify-between py-3 text-left text-sm font-semibold cursor-pointer',
                  value === option.value &&
                    'bg-surface-dropdown-item-selected hover:bg-surface-dropdown-item-selected',
                  optionClassName,
                )}
              >
                <span
                  className={cn(
                    'grow',
                    wrapLabels ? 'whitespace-normal [overflow-wrap:anywhere]' : 'whitespace-nowrap',
                  )}
                >
                  {renderLabel({ label: option.label })}
                </span>

                <Icon
                  name="mark"
                  className={cn(
                    'text-green ml-4 w-5 h-5 shrink-0 opacity-0',
                    value === option.value && 'opacity-100',
                  )}
                />
              </button>
            ))}
          </div>
        );
      },
      [onChange, options, optionClassName, dropdownClassName, value, wrapLabels],
    );

    return (
      <Dropdown
        className={className}
        modalPortalContainer={modalPortalContainer}
        optionsDom={optionsDom}
        size={size}
        label={label}
        placeLabelToLeft={placeLabelToLeft}
        menuTitle={menuTitle}
        menuPosition={menuPosition}
        triggerOnHover={triggerOnHover}
        {...otherProps}
      >
        {({ isDropdownOpen, handleToggleDropdown }) => (
          <Button
            onClick={handleToggleDropdown}
            className={cn(
              'relative w-full font-normal hover:font-semibold',
              isDropdownOpen && 'font-semibold',
              getVariantClasses({ variant, isDropdownOpen }),
              buttonSizeClasses,
              buttonClassName,
            )}
            disabled={disabled}
            contentClassName="w-full justify-center text-sm"
          >
            <input
              ref={ref}
              value={value}
              className="hidden"
              disabled={disabled}
              onChange={e => {
                const formattedValue = (
                  typeof value === 'number' ? +e.currentTarget.value : e.currentTarget.value
                ) as TValue;

                onChange(formattedValue);
              }}
              {...otherProps}
            />

            <span
              className={cn(
                'grow text-left',
                wrapLabels
                  ? 'whitespace-normal [overflow-wrap:anywhere]'
                  : 'overflow-hidden text-ellipsis whitespace-nowrap',
              )}
            >
              {selectedOption &&
                renderLabel({ label: selectedOption.label, isRenderedInButton: true })}
            </span>

            {!disabled && (
              <Icon
                name="chevronDown"
                className={cn('text-grey ml-2 size-3 flex-none', isDropdownOpen && 'rotate-180')}
              />
            )}
          </Button>
        )}
      </Dropdown>
    );
  },
);
