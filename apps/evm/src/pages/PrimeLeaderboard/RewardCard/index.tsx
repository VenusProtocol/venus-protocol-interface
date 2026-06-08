import { cn } from '@venusprotocol/ui';

export interface RewardCardProps {
  variant: 'total' | 'user';
  className?: string;
}

export const RewardCard: React.FC<RewardCardProps> = ({ variant, className }) => (
  <div
    className={cn(
      'flex h-58 items-center justify-center rounded-lg bg-background-active text-p3s text-light-grey',
      className,
    )}
  >
    {variant === 'total' ? 'Total Prime Rewards Card' : 'Your Prime Rewards Card'}
  </div>
);
