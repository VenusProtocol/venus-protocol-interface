import { cn } from 'utilities';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Container: React.FC<ContainerProps> = ({ className, ...otherProps }) => (
  <div className={cn('w-full', className)} {...otherProps} />
);
