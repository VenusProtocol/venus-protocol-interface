import type { CardProps } from 'components/Card';

export interface DropdownProps extends Omit<CardProps, 'onChange' | 'children'> {
  children: ({ isDropdownOpened }: { isDropdownOpened: boolean }) => React.ReactNode;
  optionClassName?: string;
  optionsDom: (props: {
    setIsDropdownOpened: (v: boolean) => void;
    buttonSizeClasses?: string;
  }) => React.ReactElement;
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
