import { cn } from '@venusprotocol/ui';

import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import { MarketRewardRow } from '../MarketRewardRow';

export interface MarketReward {
  token: Token;
  rewardsCents: number;
}

export interface TotalRewardsCardProps {
  totalRewardsCents: number;
  marketRewards: MarketReward[];
  title?: React.ReactNode;
  className?: string;
}

export const TotalRewardsCard: React.FC<TotalRewardsCardProps> = ({
  totalRewardsCents,
  marketRewards,
  title,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex h-58 flex-col justify-between rounded-lg bg-background-active p-4',
        className,
      )}
    >
      <div>
        <p className="text-b1r text-light-grey">
          {title ?? t('primeLeaderboard.totalRewards.title')}
        </p>

        <p className="text-h5 text-white">
          {formatCentsToReadableValue({ value: totalRewardsCents })}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {marketRewards.map(({ token, rewardsCents }) => (
          <MarketRewardRow
            key={token.address}
            token={token}
            rewardsCents={rewardsCents}
            totalRewardsCents={totalRewardsCents}
          />
        ))}
      </div>
    </div>
  );
};
