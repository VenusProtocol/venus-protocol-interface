import type { ReactElement } from 'react';

import { Button, cn } from '@venusprotocol/ui';

interface PaginationButtonProps {
  className?: string;
  onClick: () => void;
  children: number | ReactElement;
  ariaLabel?: string;
}

export const PaginationButton: React.FC<PaginationButtonProps> = ({
  className,
  onClick,
  children,
  ariaLabel,
}) => (
  <Button
    variant="text"
    className={cn(
      'mx-1 size-8 rounded bg-surface-4 p-0 text-secondary transition-colors duration-300 hover:text-primary',
      className,
    )}
    contentClassName="text-inherit"
    onClick={onClick}
    aria-label={ariaLabel}
  >
    {children}
  </Button>
);
