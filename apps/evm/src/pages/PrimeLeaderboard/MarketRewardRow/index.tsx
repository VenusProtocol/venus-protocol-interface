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
}) => (
  <div className="flex items-center justify-between">
    <TokenIconWithSymbol token={token} className="text-b1s text-white" />

    <div className="flex items-center gap-x-3">
      <span className="text-p3r text-white">
        {formatCentsToReadableValue({ value: rewardsCents })}
      </span>

      <div className="h-1.5 w-18 overflow-hidden rounded-full bg-lightGrey">
        <div
          className="h-full rounded-full bg-green"
          style={{ width: `${Math.min(100, (rewardsCents / totalRewardsCents) * 100)}%` }}
        />
      </div>

      {children}
    </div>
  </div>
);
