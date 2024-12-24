import type { CardProps } from 'components/Card';

export interface DropdownOption<TValue extends string | number = string | number> {
  value: TValue;
  label:
    | string
    | React.ReactNode
    | ((context: { isRenderedInButton: boolean }) => string | React.ReactNode);
}

export interface DropdownProps<TValue extends string | number = string | number>
  extends Omit<CardProps, 'onChange' | 'children'> {
  children: ({ isDropdownOpened }: { isDropdownOpened: boolean }) => React.ReactNode;
  value?: TValue;
  options: DropdownOption<TValue>[];
  onChange?: (newValue: DropdownOption<TValue>['value']) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  name?: string;
  'data-testid'?: string;
  placeLabelToLeft?: boolean;
  label?: string;
  className?: string;
  buttonClassName?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  menuTitle?: string;
  menuPosition?: 'left' | 'right';
}
