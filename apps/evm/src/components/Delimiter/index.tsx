import { cn } from '@venusprotocol/ui';

interface DelimiterProps {
  vertical?: boolean;
  className?: string;
}

export const Delimiter = ({ vertical, className }: DelimiterProps) =>
  vertical ? (
    <div className={cn('w-px min-h-full self-stretch bg-neutral', className)} />
  ) : (
    <hr className={cn('border-subtle', className)} />
  );
