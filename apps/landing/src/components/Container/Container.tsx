import { cn } from '@venusprotocol/ui';
import type { ReactNode } from 'react';
import s from './Container.module.css';

interface IContainerProps {
  children: ReactNode | ReactNode[];
  className?: string;
}

const Container: React.FC<IContainerProps> = ({ children, className }) => (
  <div className={cn(s.root, className)}>{children}</div>
);

export default Container;
