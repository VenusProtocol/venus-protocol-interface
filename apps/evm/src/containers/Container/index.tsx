import { cn } from '@venusprotocol/ui';

const containerClassName = 'w-full px-4 sm:px-4 md:px-6 lg:px-12 lg:mx-auto';

export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => <div className={cn(containerClassName, className)} {...props} />;
