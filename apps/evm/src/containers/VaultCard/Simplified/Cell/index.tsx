import { cn } from 'components';
import type { FC, ReactNode } from 'react';

interface CellProps {
  title: ReactNode;
  content: ReactNode;
  className?: string;
  contentClassName?: string;
}
export const Cell: FC<CellProps> = ({ title, content, className, contentClassName }) => {
  return (
    <div className={cn('flex flex-col w-full flex-1 min-w-0', className)}>
      <div className={cn('text-b1r text-light-grey mb-1')}>{title}</div>
      <div
        className={cn(
          'flex items-center gap-2 text-light-grey-active text-p2s min-w-0',
          contentClassName,
        )}
      >
        {content}
      </div>
    </div>
  );
};
