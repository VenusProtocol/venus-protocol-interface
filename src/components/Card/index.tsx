import React from 'react';

import { cn } from 'utilities';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...otherProps }) => (
  <div className={cn('w-full rounded-2xl bg-cards p-4 sm:p-6', className)} {...otherProps}>
    {children}
  </div>
);
