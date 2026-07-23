import { cn } from '@venusprotocol/ui';

import { ProgressBar, TokenIconWithSymbol } from 'components';
import type { Token } from 'types';
import { formatCentsToReadableValue } from 'utilities';

export interface MarketRewardRowProps {
  token: Token;
  rewardsCents: number;
  totalRewardsCents: number;
  apy?: React.ReactNode;
  actions?: React.ReactNode;
  progressBarClassName?: string;
}

export const MarketRewardRow: React.FC<MarketRewardRowProps> = ({
  token,
  rewardsCents,
  totalRewardsCents,
  apy,
  actions,
  progressBarClassName,
}) => {
  const progressPercentage =
    totalRewardsCents > 0
      ? Math.min(100, Math.max(0, (rewardsCents / totalRewardsCents) * 100))
      : 0;

  const isExpanded = !!(actions || apy);

  return (
    <div
      className={
        isExpanded
          ? 'flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0'
          : 'flex items-center'
      }
    >
      <div className={isExpanded ? 'flex items-center sm:contents' : 'contents'}>
        <TokenIconWithSymbol token={token} className="shrink-0 text-b1s text-white" />

        {actions && <div className="ml-auto sm:order-last sm:ml-0">{actions}</div>}
      </div>

      <div className={isExpanded ? 'flex items-center sm:contents' : 'contents'}>
        <span className={cn('text-p3r text-white', isExpanded ? 'sm:ml-auto' : 'ml-auto')}>
          {formatCentsToReadableValue({ value: rewardsCents })}
        </span>

        <div className={cn('ml-1 flex w-1/4 shrink-0 items-center', progressBarClassName)}>
          <ProgressBar
            className="w-full"
            min={0}
            max={100}
            progressBars={[{ value: progressPercentage }]}
          />
        </div>

        {apy && <div className="inline-flex ml-auto sm:ml-2">{apy}</div>}
      </div>
    </div>
  );
};
