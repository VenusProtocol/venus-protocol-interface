import { cn } from '@venusprotocol/ui';
import { Button } from 'components';

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
    variant="secondary"
    onClick={handleToggleDropdown}
    className={cn('size-8 p-0', className)}
  >
    {children}
  </Button>
);
