import { cn } from '@venusprotocol/ui';

export type WrapperProps = React.HTMLAttributes<HTMLDivElement>;

export const Wrapper: React.FC<WrapperProps> = ({ children, className, ...containerProps }) => (
  <div
    className={cn('px-5 sm:px-8 md:px-10 lg:px-16 xl:px-0 max-w-7xl mx-auto', className)}
    {...containerProps}
  >
    {children}
  </div>
);
