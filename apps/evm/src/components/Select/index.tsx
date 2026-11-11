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
        case 'raised':
          return cn('shadow-none', isDropdownOpen && 'text-primary');
        case 'secondary':
          return cn(
            'border-muted bg-neutral hover:border-brand hover:bg-neutral active:border-brand active:bg-neutral',
            isDropdownOpen && 'border-brand hover:border-brand',
          );
        case 'tertiary':
          return cn(
            'border-transparent bg-surface-4 hover:bg-surface-4 hover:border-inverse active:bg-surface-4 active:border-brand',
            isDropdownOpen && 'border-brand hover:border-brand',
          );
        case 'quaternary':
          return cn(
            'border-transparent bg-neutral rounded-xl hover:bg-neutral hover:border-bold active:bg-neutral active:border-brand',
            isDropdownOpen && 'border-brand bg-neutral hover:border-brand',
          );
        // primary
        default:
          return cn(
            'rounded-lg border-select bg-input bg-linear-to-b from-surface-raised to-surface-raised shadow-none! backdrop-blur-none! backdrop-saturate-100 hover:border-select hover:bg-input active:bg-input',
            isDropdownOpen && 'border-brand hover:border-brand',
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
                  'hover:bg-surface-segment-hover active:bg-surface-segment-hover flex min-w-full items-center justify-between py-3 text-left text-sm font-semibold cursor-pointer',
                  value === option.value && 'light:bg-selected light:hover:bg-selected',
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
                    'text-success light:text-brand ml-4 w-5 h-5 shrink-0 opacity-0',
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
            variant={variant === 'raised' ? 'secondary' : 'primary'}
            onClick={handleToggleDropdown}
            className={cn(
              'relative w-full font-normal text-primary',
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
                className={cn(
                  'text-secondary ml-2 size-3 flex-none',
                  isDropdownOpen && 'rotate-180',
                )}
              />
            )}
          </Button>
        )}
      </Dropdown>
    );
  },
);
