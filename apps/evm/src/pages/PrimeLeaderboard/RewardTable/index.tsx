import { cn } from '@venusprotocol/ui';

export interface RewardTableProps {
  className?: string;
}

export const RewardTable: React.FC<RewardTableProps> = ({ className }) => (
  <div
    className={cn(
      'flex h-239 items-center justify-center rounded-lg bg-background-active text-p3s text-light-grey',
      className,
    )}
  >
    Prime Reward Table
  </div>
);
