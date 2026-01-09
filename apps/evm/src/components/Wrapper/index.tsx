import { cn } from '@venusprotocol/ui';

export type WrapperProps = React.HTMLAttributes<HTMLDivElement>;

export const Wrapper: React.FC<WrapperProps> = ({ children, className, ...containerProps }) => (
  <div className={cn('px-4 md:px-6 xl:px-10 max-w-340 mx-auto', className)} {...containerProps}>
    {children}
  </div>
);
