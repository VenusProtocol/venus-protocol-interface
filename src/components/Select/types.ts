export interface SelectOption {
  value: string | number;
  label: string | React.ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value: SelectOption['value'];
  onChange: (newValue: SelectOption['value']) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  placeLabelToLeft?: boolean;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
}
