import { cn } from 'utilities';

import { Icon } from '../../Icon';
import { SelectOption, SelectProps } from '../types';

export interface OptionProps {
  children: SelectOption['label'];
  onClick: () => void;
  isSelected: boolean;
  variant: SelectProps['variant'];
}

export const Option: React.FC<OptionProps> = ({ children, onClick, isSelected, variant }) => (
  <button
    onClick={onClick}
    type="button"
    className={cn(
      'flex w-full items-center justify-between whitespace-nowrap py-3 text-left text-sm font-semibold hover:bg-lightGrey active:bg-lightGrey',
      variant === 'primary' ? 'px-3 sm:px-4' : 'px-3',
    )}
  >
    <span
      className={cn(
        'w-full overflow-hidden text-ellipsis',
        variant === 'secondary' && 'font-normal',
      )}
    >
      {children}
    </span>

    {isSelected && <Icon name="mark" className="ml-4 w-3 shrink-0 text-green" />}
  </button>
);
