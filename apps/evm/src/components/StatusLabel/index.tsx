import { cn } from '@venusprotocol/ui';
import type { FC, HTMLAttributes } from 'react';

export interface StatusLabelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'success' | 'warning' | 'info'; // default 'primary'
  size?: 'md';
}

const commonClassName = cn(
  'flex justify-center items-center border border-solid rounded-full py-1 px-3 text-light-grey-active text-b1r',
);

export const StatusLabel: FC<StatusLabelProps> = ({
  variant = 'primary',
  className,
  children,
  ...props
}) => {
  let variantClassName = '';
  switch (variant) {
    case 'warning':
      variantClassName = cn('border-yellow bg-yellow/10');
      break;
    case 'info':
      variantClassName = cn('border-dark-grey-hover bg-dark-grey');
      break;
    default:
      variantClassName = cn('border-blue bg-blue/10');
  }

  return (
    <div className={cn(commonClassName, variantClassName, className)} {...props}>
      {children}
    </div>
  );
};

StatusLabel.displayName = 'StatusLabel';
