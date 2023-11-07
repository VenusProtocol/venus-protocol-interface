import { Icon } from '../../Icon';
import { SelectOption } from '../types';

export interface OptionProps {
  children: SelectOption['label'];
  onClick: () => void;
  isSelected: boolean;
}

export const Option: React.FC<OptionProps> = ({ children, onClick, isSelected }) => (
  <button
    onClick={onClick}
    type="button"
    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-lightGrey active:bg-lightGrey"
  >
    {children}

    {isSelected && <Icon name="mark" className="w-3 text-green" />}
  </button>
);
