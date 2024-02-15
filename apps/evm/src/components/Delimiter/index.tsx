/** @jsxImportSource @emotion/react */
import { cn } from 'utilities';

interface DelimiterProps {
  className?: string;
}

export const Delimiter = ({ className }: DelimiterProps) => (
  <hr className={cn('bg-lightGrey mb-0 mt-0 h-[1px] border-0', className)} />
);
