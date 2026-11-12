import { cn } from '@venusprotocol/ui';

import { InfoIcon } from '../InfoIcon';

export interface ToggleProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'className' | 'onChange' | 'type' | 'value'
  > {
  value: boolean;
  className?: string;
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

      <span
        aria-hidden
        className="block h-5.5 w-11 rounded-full bg-black/22 shadow-[inset_0_0_0_1px_rgb(255_255_255/8%),inset_0_2px_3px_rgb(0_0_0/28%)] transition-[background,box-shadow] duration-200 ease-out peer-checked:bg-action peer-checked:shadow-[inset_0_1px_1px_rgb(255_255_255/25%),inset_0_-1px_1px_rgb(255_255_255/9%),0_2px_6px_rgb(0_0_0/10%)] light:bg-[rgb(30_55_85/5%)] light:shadow-[inset_0_0_0_1px_rgb(30_40_55/7%),inset_0_2px_3px_rgb(30_40_55/14%)] light:peer-checked:shadow-[inset_0_1px_1px_rgb(255_255_255/25%),inset_0_-1px_1px_rgb(255_255_255/9%),0_2px_6px_rgb(0_0_0/10%)]"
      />

      <span
        aria-hidden
        className="absolute top-0.5 left-0.5 size-4.5 rounded-full bg-white/13 shadow-[inset_0_1px_1px_rgb(255_255_255/27%),0_1px_3px_rgb(0_0_0/18%)] transition-[translate,background-color] duration-300 ease-[cubic-bezier(0.3,0.7,0.2,1)] peer-checked:translate-x-5.5 peer-checked:bg-white peer-checked:shadow-[0_1px_4px_rgb(0_0_0/28%)] light:bg-white light:shadow-[0_1px_3px_rgb(30_40_55/14%)] light:peer-checked:shadow-[0_1px_4px_rgb(0_0_0/28%)]"
      />
    </label>
  </div>
);
