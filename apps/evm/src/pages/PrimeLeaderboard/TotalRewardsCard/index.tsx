import { cn } from '@venusprotocol/ui';

export interface TotalRewardsCardProps {
  className?: string;
}

export const TotalRewardsCard: React.FC<TotalRewardsCardProps> = ({ className }) => (
  <div
    className={cn(
      'flex h-58 items-center justify-center rounded-lg bg-background-active text-p3s text-light-grey',
      className,
    )}
  >
    Total Prime Rewards Card
  </div>
);
