import { type InputHTMLAttributes, forwardRef } from 'react';

import type { Token } from 'types';

import { cn } from '@venusprotocol/ui';
import { Icon, type IconName } from '../Icon';
import { TokenIcon } from '../TokenIcon';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  ref?: React.Ref<HTMLInputElement>;
  className?: string;
  inputContainerClassName?: string;
  label?: string;
  description?: string | React.ReactElement;
  hasError?: boolean;
  leftIconSrc?: IconName | Token;
  rightAdornment?: React.ReactElement;
  size?: 'xxs' | 'xs' | 'md';
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export const TextField: React.FC<TextFieldProps> = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      inputContainerClassName,
      label,
      description,
      hasError = false,
      leftIconSrc,
      rightAdornment,
      onChange,
      max,
      min,
      type,
      disabled,
      size = 'md',
      variant = 'primary',
      ...inputProps
    },
    ref,
  ) => {
    const handleChange: InputHTMLAttributes<HTMLInputElement>['onChange'] = e => {
      let safeValue = e.currentTarget.value;

      if (type === 'number' && safeValue.startsWith('.')) {
        safeValue = `0${safeValue}`;
      }

      // Prevent value from being updated if it does not follow the rules
      const followsMaxRule =
        !safeValue ||
        max === undefined ||
        type !== 'number' ||
        Number.parseInt(safeValue, 10) <= +max;

      const followsMinRule =
        !safeValue ||
        min === undefined ||
        type !== 'number' ||
        Number.parseInt(safeValue, 10) >= +min;

      if (onChange && followsMaxRule && followsMinRule) {
        onChange(e);
      }
    };

    const leftIconClassNames = cn('mr-2 mt-0', size === 'md' ? 'size-6' : 'size-5');

    let inputContainerCn = cn(
      'flex items-center h-15 pr-2 pl-4 py-2 border border-lightGrey rounded-xl bg-background transition-[border-color] hover:border-offWhite focus-within:border-blue focus-within:hover:border-blue',
      size === 'xs' && 'h-10 py-1 rounded-lg',
      size === 'xxs' && 'h-8 py-1 rounded-[4px] px-3',
      variant === 'tertiary' &&
        'bg-lightGrey text-grey hover:text-offWhite hover:border-transparent focus-within:text-offWhite',
      disabled && 'border-lightGrey bg-cards',
      hasError && 'border-red focus-within:border-red',
    );

    if (variant === 'secondary') {
      inputContainerCn = cn(inputContainerCn, disabled ? 'bg-lightGrey' : 'bg-cards');
    }

    inputContainerCn = cn(inputContainerCn, inputContainerClassName);

    return (
      <div className={className}>
        {!!label && (
          <label className="text-sm font-semibold text-grey" htmlFor={inputProps.id}>
            {label}
          </label>
        )}

        <div className={inputContainerCn}>
          {typeof leftIconSrc === 'string' && (
            <Icon name={leftIconSrc} className={leftIconClassNames} />
          )}

          {!!leftIconSrc && typeof leftIconSrc !== 'string' && (
            <TokenIcon token={leftIconSrc} className={leftIconClassNames} />
          )}

          <input
            className={cn(
              'bg-transparent flex-1 h-full font-semibold leading-6 w-full placeholder:text-grey outline-none',
              !!rightAdornment && 'mr-1',
              (size === 'xs' || size === 'xxs') && 'text-sm',
            )}
            max={max}
            min={min}
            onChange={handleChange}
            type={type}
            disabled={disabled}
            ref={ref}
            {...inputProps}
          />

          {rightAdornment}
        </div>

        {!!description && <p className="block mt-1 text-grey text-sm">{description}</p>}
      </div>
    );
  },
);
