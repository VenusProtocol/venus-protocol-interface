import { cn } from '@venusprotocol/ui';

import { Icon } from '../Icon';

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'checked' | 'className' | 'onChange' | 'type' | 'value'
  > {
  value: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const Checkbox = ({
  value,
  className,
  disabled,
  onChange,
  ...otherProps
}: CheckboxProps) => (
  <label
    className={cn(
      'relative top-px inline-block cursor-pointer pt-px',
      disabled && 'cursor-default',
      className,
    )}
  >
    <input
      checked={value}
      className="sr-only"
      disabled={disabled}
      onChange={onChange}
      type="checkbox"
      {...otherProps}
    />

    <Icon name={value ? 'checked' : 'checkboxBorder'} className="size-5 translate-y-px" />
  </label>
);

export default Checkbox;
