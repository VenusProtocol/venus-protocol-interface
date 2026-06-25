import { cn } from '@venusprotocol/ui';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import { useGetPools } from 'clients/api';
import { Apy, Spinner } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Token } from 'types';
import { areAddressesEqual, formatCentsToReadableValue } from 'utilities';

import { MarketActionsButton } from '../MarketActionsButton';
import { MarketRewardRow } from '../MarketRewardRow';

export interface UserMarketReward {
  token: Token;
  rewardsCents: number;
}

export interface UserRewardsCardProps {
  totalRewardsCents: number;
  marketRewards: UserMarketReward[];
  title?: React.ReactNode;
  // Replaces the default headline (Prime badge + total amount), e.g. an eligibility message
  content?: React.ReactNode;
  // Toggles the per-market Prime APY and actions menu, hidden when the card is a read-only summary
  showMarketActions?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const UserRewardsCard: React.FC<UserRewardsCardProps> = ({
  totalRewardsCents,
  marketRewards,
  title,
  content,
  showMarketActions = true,
  isLoading,
  className,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const { data: getPoolsData } = useGetPools({ accountAddress });

  // Prime reward tokens only carry an underlying address, and the same underlying can be listed in
  // several pools, so the markets are resolved from the core pool where the Prime markets live
  const corePool = getPoolsData?.pools.find(pool => !pool.isIsolated);

  const marketRewardsWithMarket = marketRewards.map(marketReward => {
    const asset = corePool?.assets.find(poolAsset =>
      areAddressesEqual(poolAsset.vToken.underlyingToken.address, marketReward.token.address),
    );

    return { ...marketReward, asset, poolComptrollerAddress: corePool?.comptrollerAddress };
  });

  const cardClassName = cn(
    'flex flex-col gap-y-3 rounded-lg bg-background-active p-4 min-h-[182px] lg:h-58',
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
      <div className={cn(content && 'flex flex-col gap-1')}>
        <p className="text-b1r text-light-grey">
          {title ?? t('primeLeaderboard.userRewards.title')}
        </p>

        {content ?? (
          <div className="flex items-center gap-x-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#805c4e]">
              <img
                src={primeLogoSrc}
                alt={t('primeLeaderboard.userRewards.primeLogoAlt')}
                className="h-5"
              />
            </span>

            <p className="text-h5 text-white">
              {formatCentsToReadableValue({ value: totalRewardsCents })}
            </p>
          </div>
        )}
      </div>

      <div className="flex max-h-14 flex-col gap-2 overflow-y-auto pr-2">
        {marketRewardsWithMarket.map(({ token, rewardsCents, asset, poolComptrollerAddress }) => (
          <MarketRewardRow
            key={token.address}
            token={token}
            rewardsCents={rewardsCents}
            totalRewardsCents={totalRewardsCents}
            progressBarClassName="xl:w-8 2xl:w-1/4"
            apy={showMarketActions && asset && <Apy asset={asset} type="supply" />}
            actions={
              showMarketActions &&
              asset &&
              poolComptrollerAddress && (
                <MarketActionsButton
                  asset={asset}
                  poolComptrollerAddress={poolComptrollerAddress}
                />
              )
            }
          />
        ))}
      </div>
    </div>
  );
};
