import { cn } from '@venusprotocol/ui';

export interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ className, children }) => (
  <span
    className={cn('nav-tag inline-block rounded-full px-1.5 py-0.5 text-b3s text-white', className)}
  >
    {children}
  </span>
);
