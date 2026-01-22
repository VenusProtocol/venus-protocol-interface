/** @jsxImportSource @emotion/react */
import { cn } from '@venusprotocol/ui';

interface DelimiterProps {
  className?: string;
}

export const Delimiter = ({ className }: DelimiterProps) => (
  <hr className={cn('border-dark-blue-hover', className)} />
);
