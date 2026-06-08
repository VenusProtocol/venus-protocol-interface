import { cn } from '@venusprotocol/ui';

export interface RankCardProps {
  className?: string;
}

export const RankCard: React.FC<RankCardProps> = ({ className }) => (
  <div
    className={cn(
      'flex h-58 items-center justify-center rounded-lg bg-background-active text-p3s text-light-grey',
      className,
    )}
  >
    Rank Card
  </div>
);
