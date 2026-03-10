import { cn } from '@venusprotocol/ui';
import { type InputHTMLAttributes, forwardRef } from 'react';

import { Icon, type IconName } from 'components/Icon';
import { TokenIconWithSymbol } from 'components/TokenIconWithSymbol';
import type { Token } from 'types';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  ref?: React.Ref<HTMLInputElement>;
  className?: string;
  inputContainerClassName?: string;
  label?: string;
  description?: string | React.ReactElement;
  hasError?: boolean;
  leftIconSrc?: IconName | Token;
  leftAdornment?: React.ReactElement;
  rightAdornment?: React.ReactElement;
  topRightAdornment?: React.ReactElement;
  size?: 'xs' | 'md';
  variant?: 'primary' | 'secondary';
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
      leftAdornment,
      rightAdornment,
      topRightAdornment,
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

    return (
      <div className={cn('flex flex-col gap-y-2', className)}>
        {(!!label || topRightAdornment) && (
          <div className="flex items-center justify-between">
            {!!label && (
              <label className="text-b1r text-light-grey block" htmlFor={inputProps.id}>
                {label}
              </label>
            )}

            {topRightAdornment && <div className="ml-auto">{topRightAdornment}</div>}
          </div>
        )}

        <div
          className={cn(
            'flex items-center justify-between gap-x-4 h-14 p-4 border border-dark-blue-hover rounded-xl bg-dark-blue transition-[border-color] focus-within:border-blue focus-within:hover:border-blue',
            rightAdornment && 'pr-2',
            leftAdornment && !leftIconSrc && 'pl-2',
            size === 'xs' && 'h-10 py-1 rounded-lg',
            disabled && 'border-lightGrey bg-cards',
            hasError && 'border-red focus-within:border-red focus-within:hover:border-red',
            variant === 'secondary' && disabled && 'bg-lightGrey',
            variant === 'secondary' && !disabled && 'bg-cards',
            inputContainerClassName,
          )}
        >
          {(!!leftIconSrc || leftAdornment) && (
            <div className="flex items-center gap-x-2 shrink-0">
              {typeof leftIconSrc === 'string' && <Icon name={leftIconSrc} className="size-5" />}

              {!!leftIconSrc && typeof leftIconSrc !== 'string' && (
                <TokenIconWithSymbol token={leftIconSrc} size="md" />
              )}

              {leftAdornment}
            </div>
          )}

          <div className="flex grow items-center gap-x-2">
            <input
              className={cn(
                'bg-transparent w-full h-full font-semibold leading-6 placeholder:text-grey outline-hidden',
                type === 'number' && 'text-right',
                size === 'xs' && 'text-sm',
              )}
              max={max}
              min={min}
              onChange={handleChange}
              type={type}
              disabled={disabled}
              ref={ref}
              {...inputProps}
            />

            {rightAdornment && <div className="shrink-0">{rightAdornment}</div>}
          </div>
        </div>

        {!!description && <div className="block mt-1 text-grey text-sm">{description}</div>}
      </div>
    );
  },
);
