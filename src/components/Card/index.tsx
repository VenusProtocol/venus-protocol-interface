import React from 'react';
import { cn } from 'utilities';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={cn('w-full rounded-2xl bg-cards p-4 md:p-6', className)}>{children}</div>
);
