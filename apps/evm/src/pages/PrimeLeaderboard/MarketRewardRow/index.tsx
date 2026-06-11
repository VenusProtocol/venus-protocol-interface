import { TokenIconWithSymbol } from 'components';
import type { Token } from 'types';
import { formatCentsToReadableValue } from 'utilities';

export interface MarketRewardRowProps {
  token: Token;
  rewardsCents: number;
  totalRewardsCents: number;
  children?: React.ReactNode;
}

export const MarketRewardRow: React.FC<MarketRewardRowProps> = ({
  token,
  rewardsCents,
  totalRewardsCents,
  children,
}) => {
  const progressPercentage =
    totalRewardsCents > 0 ? Math.min(100, (rewardsCents / totalRewardsCents) * 100) : 0;

  return (
    <div className="flex items-center">
      <TokenIconWithSymbol token={token} className="shrink-0 text-b1s text-white" />

      <span className="ml-auto text-p3r text-white">
        {formatCentsToReadableValue({ value: rewardsCents })}
      </span>

      <div className="ml-1 h-1.5 w-1/4 shrink-0 overflow-hidden rounded-full bg-lightGrey">
        <div className="h-full rounded-full bg-green" style={{ width: `${progressPercentage}%` }} />
      </div>

      {children}
    </div>
  );
};
