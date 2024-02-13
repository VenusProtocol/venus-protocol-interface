import { cn } from 'utilities';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...otherProps }) => (
  <div className={cn('bg-cards w-full rounded-2xl p-4 sm:p-6', className)} {...otherProps}>
    {children}
  </div>
);
