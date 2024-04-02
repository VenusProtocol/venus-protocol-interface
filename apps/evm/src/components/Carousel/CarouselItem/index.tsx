import { cn } from 'utilities';

export const CarouselItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div className={cn('min-w-0 shrink-0 grow-0 basis-full overflow-hidden', className)} {...props} />
);
