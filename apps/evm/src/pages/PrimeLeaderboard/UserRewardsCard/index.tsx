import { cn } from '@venusprotocol/ui';

export interface UserRewardsCardProps {
  className?: string;
}

export const UserRewardsCard: React.FC<UserRewardsCardProps> = ({ className }) => (
  <div
    className={cn(
      'flex h-58 items-center justify-center rounded-lg bg-background-active text-p3s text-light-grey',
      className,
    )}
  >
    Your Prime Rewards Card
  </div>
);
