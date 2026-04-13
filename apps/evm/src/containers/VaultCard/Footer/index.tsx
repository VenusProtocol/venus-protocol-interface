import { cn } from 'components';
import type { FC, ReactNode } from 'react';

interface FooterProps {
  label: ReactNode;
  content: ReactNode;
}

export const Footer: FC<FooterProps> = ({ label = null, content = null }) => {
  return (
    <div className={cn('bg-cards px-4 sm:px-6 py-4 flex items-center justify-between')}>
      <span className="text-b1s">{label}</span>

      <div className={cn('flex items-center gap-x-3 text-b1s')}>
        <span>{content}</span>
      </div>
    </div>
  );
};
