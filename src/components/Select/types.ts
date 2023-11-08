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
  onChange: (newValue: SelectOption<TValue>['value']) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  testId?: string;
  placeLabelToLeft?: boolean;
  label?: string;
  className?: string;
  buttonClassName?: string;
  variant?: 'primary' | 'secondary';
  menuTitle?: string;
  menuPosition?: 'left' | 'right';
}
