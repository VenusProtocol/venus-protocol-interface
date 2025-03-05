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
    <div
      className={cn('border-lightGrey md:rounded-2xl md:border px-4 md:py-6 bg-cards', className)}
    >
      <div className="border-lightGrey flex items-center justify-between border-b pb-4 mb-4">
        <p className="text-lg">{title}</p>
        {claimComponent}
      </div>
      {children}
    </div>
  );
};
