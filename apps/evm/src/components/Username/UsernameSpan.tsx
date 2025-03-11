import { cn } from '@venusprotocol/ui';

interface UsernameSpanProps {
  className?: string;
  username: string;
}

const UsernameSpan = ({ className, username }: UsernameSpanProps) => (
  <span className={cn('truncate', className)}>{username}</span>
);

export default UsernameSpan;
