import { cn } from 'utilities';

export const CarouselItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn('overflow-hidden', className)} {...props} />;
