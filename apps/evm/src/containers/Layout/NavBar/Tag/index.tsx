import { cn } from '@venusprotocol/ui';

export interface TagProps {
  children: React.ReactNode;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ className, children }) => (
  <span
    className={cn(
      'inline-block rounded-full bg-blue px-1.5 py-0.5 text-b3s text-white shadow-[0_0_4px_0_rgb(17_153_250/25%)]',
      className,
    )}
  >
    {children}
  </span>
);
