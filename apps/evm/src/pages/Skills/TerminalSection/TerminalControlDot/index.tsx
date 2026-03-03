import { cn } from '@venusprotocol/ui';

interface TerminalControlDotProps {
  variant: 'red' | 'yellow' | 'green';
}

export const TerminalControlDot: React.FC<TerminalControlDotProps> = ({ variant }) => (
  <div
    className={cn(
      'h-[13px] w-[13px] rounded-full',
      variant === 'red' && 'bg-red',
      variant === 'yellow' && 'bg-yellow',
      variant === 'green' && 'bg-green',
    )}
  />
);
