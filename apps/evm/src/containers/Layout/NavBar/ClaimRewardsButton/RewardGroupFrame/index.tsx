import { cn } from '@venusprotocol/ui';

export interface RewardGroupFrameProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  claimComponent?: React.ReactNode;
}

export const RewardGroupFrame: React.FC<RewardGroupFrameProps> = ({
  className,
  children,
  claimComponent,
  title,
}: RewardGroupFrameProps) => {
  return (
    <div className={cn('rounded-lg border border-subtle p-4', className)}>
      <div className="border-subtle flex items-center justify-between border-b pb-4 mb-4">
        <p className="text-lg">{title}</p>
        {claimComponent}
      </div>
      {children}
    </div>
  );
};
