import { cn } from '@venusprotocol/ui';

export interface RankTableProps {
  className?: string;
}

export const RankTable: React.FC<RankTableProps> = ({ className }) => (
  <div
    className={cn(
      'flex h-239 items-center justify-center rounded-lg bg-background-active text-p3s text-light-grey',
      className,
    )}
  >
    Rank Table
  </div>
);
