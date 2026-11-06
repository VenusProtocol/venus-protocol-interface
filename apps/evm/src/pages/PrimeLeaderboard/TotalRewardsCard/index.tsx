import { cn } from '@venusprotocol/ui';

import { Spinner } from 'components';
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
  totalEstimatedRewardsCents: number;
  marketRewards: MarketReward[];
  title?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

export const TotalRewardsCard: React.FC<TotalRewardsCardProps> = ({
  totalRewardsCents,
  totalEstimatedRewardsCents,
  marketRewards,
  title,
  isLoading,
  className,
}) => {
  const { t, Trans } = useTranslation();

  const cardClassName = cn(
    'flex flex-col gap-y-3 rounded-lg p-4 min-h-[182px] relative isolate border border-border-glass bg-surface-glass shadow-glass before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:backdrop-blur-glass',
    className,
  );

  if (isLoading) {
    return (
      <div className={cn(cardClassName, 'items-center justify-center')}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={cn(cardClassName, 'justify-between')}>
      <div>
        <p className="text-b1r text-light-grey">
          {title ?? t('primeLeaderboard.totalRewards.title')}
        </p>

        <p className="text-h5 text-white">
          {formatCentsToReadableValue({ value: totalRewardsCents })}
        </p>

        {!!totalEstimatedRewardsCents && (
          <p className="text-b1r text-light-grey">
            <Trans
              i18nKey="primeLeaderboard.totalRewards.totalPoolLabel"
              components={{ Highlight: <span className="text-white" /> }}
              values={{ amount: formatCentsToReadableValue({ value: totalEstimatedRewardsCents }) }}
            />
          </p>
        )}
      </div>

      <div className="flex max-h-15 flex-col gap-2 overflow-y-auto">
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
