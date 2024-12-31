import { forwardRef, useCallback, useMemo } from 'react';

import { Dropdown } from '../Dropdown';

import { cn } from 'utilities';
import { renderLabel } from '../Dropdown/renderLabel';
import { Icon } from '../Icon';
import type { SelectProps } from './types';

export * from './types';

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  <TValue extends string | number = string | number>(
    { options, value, onChange, size, ...otherProps }: SelectProps,
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const selectedOption = useMemo(
      () => options.find(option => option.value === value),
      [value, options],
    );

    const optionsDom = useCallback(
      ({
        setIsDropdownOpened,
        optionClassName,
      }: { setIsDropdownOpened: (v: boolean) => void; optionClassName?: string }) => {
        const handleChange = (newValue: typeof value) => {
          onChange(newValue);
          setIsDropdownOpened(false);
        };
        return (
          <>
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => handleChange(option.value)}
                type="button"
                className={cn(
                  'hover:bg-lightGrey active:bg-lightGrey flex min-w-full items-center justify-between py-3 text-left text-sm font-semibold',
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
                    value === option.value && 'opacity-1',
                  )}
                />
              </button>
            ))}
          </>
        );
      },
      [onChange, options, value],
    );

    return (
      <Dropdown optionsDom={optionsDom} size={size} {...otherProps}>
        {({ isDropdownOpened }) => (
          <>
            <input
              ref={ref}
              value={value}
              className="hidden"
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

            <Icon
              name="arrowUp"
              className={cn(
                'text-offWhite ml-2 w-5 h-5 flex-none',
                isDropdownOpened ? 'text-blue' : 'rotate-180',
              )}
            />
          </>
        )}
      </Dropdown>
    );
  },
);
