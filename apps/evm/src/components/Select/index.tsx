import { forwardRef, useCallback, useMemo } from 'react';

import { Dropdown } from '../Dropdown';

import { Button } from '@venusprotocol/ui';
import { cn } from '@venusprotocol/ui';
import { renderLabel } from '../Dropdown/renderLabel';
import { Icon } from '../Icon';
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
      ...otherProps
    }: SelectProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const selectedOption = useMemo(
      () => options.find(option => option.value === value),
      [value, options],
    );

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
      isDropdownOpened,
    }: {
      variant: SelectProps['variant'];
      isDropdownOpened: boolean;
    }) => {
      switch (variant) {
        case 'secondary':
          return cn(
            'border-lightGrey bg-lightGrey hover:border-blue hover:bg-lightGrey active:border-blue active:bg-lightGrey',
            isDropdownOpened && 'border-blue hover:border-blue',
          );
        case 'tertiary':
          return cn(
            'border-transparent bg-cards hover:bg-cards hover:border-white active:bg-cards active:border-blue',
            isDropdownOpened && 'border-blue hover:border-blue',
          );
        case 'quaternary':
          return cn(
            'border-transparent bg-lightGrey rounded-xl hover:bg-lightGrey hover:border-grey active:bg-lightGrey active:border-blue',
            isDropdownOpened && 'border-blue bg-lightGrey hover:border-blue',
          );
        // primary
        default:
          return cn(
            'border-dark-blue-disabled/50 bg-dark-blue hover:bg-dark-blue-hover active:bg-dark-blue-hover',
            isDropdownOpened && 'bg-dark-blue-hover hover:border-blue',
          );
      }
    };

    const optionsDom = useCallback(
      ({ setIsDropdownOpened }: { setIsDropdownOpened: (v: boolean) => void }) => {
        const handleChange = (newValue: typeof value) => {
          onChange(newValue);
          setIsDropdownOpened(false);
        };
        return (
          <div className={dropdownClassName}>
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => handleChange(option.value)}
                type="button"
                className={cn(
                  'hover:bg-lightGrey active:bg-lightGrey flex min-w-full items-center justify-between py-3 text-left text-sm font-semibold cursor-pointer',
                  optionClassName,
                )}
              >
                <span className={cn('grow whitespace-nowrap')}>
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
      [onChange, options, optionClassName, dropdownClassName, value],
    );

    return (
      <Dropdown className={className} optionsDom={optionsDom} size={size} {...otherProps}>
        {({ isDropdownOpened, handleToggleDropdown }) => (
          <Button
            onClick={handleToggleDropdown}
            className={cn(
              'relative w-full',
              getVariantClasses({ variant, isDropdownOpened }),
              buttonSizeClasses,
              buttonClassName,
            )}
            disabled={disabled}
            contentClassName={cn('w-full justify-center text-sm font-semibold')}
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

            <span className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left">
              {selectedOption &&
                renderLabel({ label: selectedOption.label, isRenderedInButton: true })}
            </span>

            {!disabled && (
              <Icon
                name="chevronDown"
                className={cn('text-grey ml-2 size-3 flex-none', isDropdownOpened && 'rotate-180')}
              />
            )}
          </Button>
        )}
      </Dropdown>
    );
  },
);
