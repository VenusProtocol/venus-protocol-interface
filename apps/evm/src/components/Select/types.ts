import type { DropdownProps } from 'components/Dropdown';

export interface SelectOption<TValue extends string | number = string | number> {
  value: TValue;
  label:
    | string
    | React.ReactNode
    | ((context: { isRenderedInButton: boolean }) => string | React.ReactNode);
}

export interface SelectProps<TValue extends string | number = string | number> {
  value: TValue;
  options: SelectOption<TValue>[];
  optionClassName?: DropdownProps['optionClassName'];
  onChange: (newValue: TValue) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  'data-testid'?: string;
  placeLabelToLeft?: boolean;
  label?: string;
  className?: string;
  dropdownClassName?: string;
  buttonClassName?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  menuTitle?: string;
  menuPosition?: 'left' | 'right';
  disabled?: boolean;
}
