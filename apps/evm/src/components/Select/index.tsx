import { forwardRef, useMemo } from 'react';

import { Dropdown, type DropdownProps } from '../Dropdown';

import { cn } from 'utilities';
import { renderLabel } from '../Dropdown/renderLabel';
import { Icon } from '../Icon';

export * from './types';

type SelectProps<TValue extends string | number = string | number> = Omit<
  DropdownProps<TValue>,
  'children'
>;

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  ({ options, value, ...otherProps }: SelectProps, ref: React.Ref<HTMLInputElement>) => {
    const selectedOption = useMemo(
      () => options.find(option => option.value === value),
      [value, options],
    );

    return (
      <Dropdown ref={ref} options={options} value={value} {...otherProps}>
        {({ isDropdownOpened }) => (
          <>
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
