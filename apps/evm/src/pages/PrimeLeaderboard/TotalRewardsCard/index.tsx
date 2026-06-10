import { cn } from '@venusprotocol/ui';

import { TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatCentsToReadableValue } from 'utilities';

export interface MarketReward {
  token: Token;
  rewardsCents: number;
}

export interface TotalRewardsCardProps {
  totalRewardsCents: number;
  marketRewards: MarketReward[];
  className?: string;
}

export const TotalRewardsCard: React.FC<TotalRewardsCardProps> = ({
  totalRewardsCents,
  marketRewards,
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
        <p className="text-b1r text-light-grey">{t('primeLeaderboard.totalRewards.title')}</p>

        <p className="text-h5 text-white">
          {formatCentsToReadableValue({ value: totalRewardsCents })}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {marketRewards.map(({ token, rewardsCents }) => (
          <div key={token.address} className="flex items-center justify-between">
            <TokenIconWithSymbol token={token} />

            <div className="flex items-center gap-x-3">
              <span className="text-p3r text-white">
                {formatCentsToReadableValue({ value: rewardsCents })}
              </span>

              <div className="h-1.5 w-18 overflow-hidden rounded-full bg-lightGrey">
                <div
                  className="h-full rounded-full bg-green"
                  style={{
                    width: `${Math.min(100, (rewardsCents / totalRewardsCents) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
