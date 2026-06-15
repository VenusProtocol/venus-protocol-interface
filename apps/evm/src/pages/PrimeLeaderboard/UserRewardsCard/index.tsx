import { cn } from '@venusprotocol/ui';

import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';

import { MarketActions } from '../MarketActions';
import { MarketRewardRow } from '../MarketRewardRow';
import { PrimeRewardBadge } from '../PrimeRewardBadge';

export interface UserMarketReward {
  token: Token;
  rewardsCents: number;
  apyPercentage: number;
}

export interface UserRewardsCardProps {
  totalRewardsCents: number;
  marketRewards: UserMarketReward[];
  // Replaces the default headline (Prime badge + total amount). Used by the rules modal to show a
  // contextual message instead of the amount
  content?: React.ReactNode;
  // Toggles the per-market Prime APY and actions menu, which are hidden when the card is used as a
  // read-only summary
  showMarketActions?: boolean;
  className?: string;
}

export const UserRewardsCard: React.FC<UserRewardsCardProps> = ({
  totalRewardsCents,
  marketRewards,
  content,
  showMarketActions = true,
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
        <p className="text-b1r text-light-grey">{t('primeLeaderboard.userRewards.title')}</p>

        {content ?? (
          <div className="flex items-center gap-x-3">
            <PrimeRewardBadge />

            <p className="text-h5 text-white">
              {formatCentsToReadableValue({ value: totalRewardsCents })}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {marketRewards.map(({ token, rewardsCents, apyPercentage }) => (
          <MarketRewardRow
            key={token.address}
            token={token}
            rewardsCents={rewardsCents}
            totalRewardsCents={totalRewardsCents}
          >
            {showMarketActions && (
              <>
                <div className="ml-2 flex items-center gap-x-1 text-green">
                  <Icon name="sparkle" />

                  <span className="text-b1s">{formatPercentageToReadableValue(apyPercentage)}</span>
                </div>

                <MarketActions token={token} />
              </>
            )}
          </MarketRewardRow>
        ))}
      </div>
    </div>
  );
};
