import cn from 'classnames';
import type { ReactElement } from 'react';
import s from './Container.module.css';

interface IContainerProps {
  children: ReactElement | ReactElement[];
  className?: string;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

const Container: React.FC<IContainerProps> = ({
  children,
  className,
  onMouseEnter,
  onMouseLeave,
}) => (
  <div className={cn(s.root, className)} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    {children}
  </div>
);

export default Container;
