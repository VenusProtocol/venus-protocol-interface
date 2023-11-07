export interface SelectOption {
  value: string | number;
  label: string | React.ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value: SelectOption['value'];
  onChange: (newValue: SelectOption['value']) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  placeLabelToLeft?: boolean;
  label?: string;
  className?: string;
}
