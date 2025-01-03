import { Button } from 'components';
import { cn } from 'utilities';

interface DropdownToggleButtonProps {
  className?: string;
  handleToggleDropdown: () => void;
  children: React.ReactNode;
}

export const DropdownToggleButton = ({
  className,
  handleToggleDropdown,
  children,
}: DropdownToggleButtonProps) => (
  <Button
    onClick={handleToggleDropdown}
    className={cn(
      'relative w-full bg-transparent p-0 border-transparent hover:border-transparent hover:bg-transparent h-8',
      className,
    )}
    contentClassName={cn(
      'disabled:text-grey inline-flex cursor-pointer items-center justify-center rounded-lg font-semibold p-1 h-8 w-8 transition-all duration-[250ms]',
      'relative w-full border-transparent bg-background/40 hover:bg-background/40 active:bg-background/40',
    )}
  >
    {children}
  </Button>
);
