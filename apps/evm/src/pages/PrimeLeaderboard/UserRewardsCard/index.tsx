import { cn } from '@venusprotocol/ui';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';

import { MarketRewardRow } from '../MarketRewardRow';

export interface UserMarketReward {
  token: Token;
  rewardsCents: number;
  apyPercentage: number;
}

export interface UserRewardsCardProps {
  totalRewardsCents: number;
  marketRewards: UserMarketReward[];
  className?: string;
}

export const UserRewardsCard: React.FC<UserRewardsCardProps> = ({
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
        <p className="text-b1r text-light-grey">{t('primeLeaderboard.userRewards.title')}</p>

        <div className="flex items-center gap-x-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#805c4e]">
            <img src={primeLogoSrc} alt="" className="h-5" />
          </span>

          <p className="text-h5 text-white">
            {formatCentsToReadableValue({ value: totalRewardsCents })}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {marketRewards.map(({ token, rewardsCents, apyPercentage }) => (
          <MarketRewardRow
            key={token.address}
            token={token}
            rewardsCents={rewardsCents}
            totalRewardsCents={totalRewardsCents}
          >
            <div className="ml-2 flex items-center gap-x-1 text-green">
              <Icon name="sparkle" />

              <span className="text-b1s">{formatPercentageToReadableValue(apyPercentage)}</span>
            </div>

            <button
              type="button"
              aria-label={t('primeLeaderboard.userRewards.marketActions')}
              className="ml-2 shrink-0"
            >
              <Icon name="dots" className="text-light-grey" />
            </button>
          </MarketRewardRow>
        ))}
      </div>
    </div>
  );
};
