/** @jsxImportSource @emotion/react */
import { cn } from '@venusprotocol/ui';

interface DelimiterProps {
  className?: string;
}

export const Delimiter = ({ className }: DelimiterProps) => (
  <hr className={cn('bg-lightGrey mb-0 mt-0 h-px border-0', className)} />
);
