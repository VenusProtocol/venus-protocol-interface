/** @jsxImportSource @emotion/react */
import { cn } from '@venusprotocol/ui';

interface DelimiterProps {
  vertical?: boolean;
  className?: string;
}

export const Delimiter = ({ vertical, className }: DelimiterProps) =>
  vertical ? (
    <div className={cn('w-px min-h-full self-stretch bg-lightGrey', className)} />
  ) : (
    <hr className={cn('border-dark-blue-hover', className)} />
  );
