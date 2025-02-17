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
      'p-0 border-transparent hover:border-transparent h-8 w-8 bg-background/40 hover:bg-background/40',
      className,
    )}
  >
    {children}
  </Button>
);
