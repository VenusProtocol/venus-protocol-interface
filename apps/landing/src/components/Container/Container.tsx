import { cn } from '@venusprotocol/ui';
import type { ReactNode } from 'react';

interface IContainerProps {
  children: ReactNode | ReactNode[];
  className?: string;
}

const Container: React.FC<IContainerProps> = ({ children, className }) => (
  <div className={cn('w-full px-4 sm:px-6 md:px-8 lg:px-12 lg:mx-auto', className)}>{children}</div>
);

export default Container;
