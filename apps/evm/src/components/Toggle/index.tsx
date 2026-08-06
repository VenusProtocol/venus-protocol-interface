import { cn } from '@venusprotocol/ui';

import { InfoIcon } from '../InfoIcon';

export interface ToggleProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'className' | 'onChange' | 'type' | 'value'
  > {
  value: boolean;
  className?: string;
  isDark?: boolean;
  label?: string;
  tooltip?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

export const switchAriaLabel = 'Switch';

export const Toggle = ({
  onChange,
  onClick,
  value,
  className,
  isDark = false,
  disabled = false,
  label,
  tooltip,
  readOnly,
  ...otherProps
}: ToggleProps) => (
  <div className={cn('inline-flex items-center', className)}>
    {!!tooltip && <InfoIcon className="mr-2" tooltip={tooltip} />}

    {!!label && <span className="mr-2 whitespace-nowrap text-sm">{label}</span>}

    <label
      className={cn(
        'relative inline-flex h-5.5 w-11 shrink-0',
        disabled ? 'cursor-default opacity-50' : 'cursor-pointer',
      )}
      onClick={event => event.stopPropagation()}
    >
      <input
        {...otherProps}
        aria-label={switchAriaLabel}
        checked={value}
        className="peer sr-only"
        disabled={disabled}
        onChange={event => onChange?.(event, event.currentTarget.checked)}
        onClick={event => {
          onClick?.(event);
          event.stopPropagation();
        }}
        readOnly={readOnly || !onChange}
        type="checkbox"
      />

      <span aria-hidden className="block h-5.5 w-11 rounded-full bg-lightGrey" />

      <span
        aria-hidden
        className={cn(
          'absolute top-0 left-0 size-5.5 rounded-full transition-transform duration-300 peer-checked:translate-x-5.5 peer-checked:bg-blue',
          isDark ? 'bg-lightGrey' : 'bg-grey',
        )}
      />
    </label>
  </div>
);
