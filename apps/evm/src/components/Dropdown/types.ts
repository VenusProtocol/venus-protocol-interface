import type { FocusEventHandler } from 'react';

export interface DropdownProps {
  children: ({
    isDropdownOpen,
    handleToggleDropdown,
  }: { isDropdownOpen: boolean; handleToggleDropdown: () => void }) => React.ReactNode;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  optionClassName?: string;
  optionsDom: (props: {
    setIsDropdownOpen: (v: boolean) => void;
    optionClassName?: string;
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
  menuClassName?: string;
  triggerOnHover?: boolean;
}
