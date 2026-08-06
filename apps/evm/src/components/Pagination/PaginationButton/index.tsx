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
      'mx-1 size-8 rounded bg-cards p-0 text-grey transition-colors duration-300 hover:text-white',
      className,
    )}
    contentClassName="text-inherit"
    onClick={onClick}
    aria-label={ariaLabel}
  >
    {children}
  </Button>
);
