import { cn } from '@venusprotocol/ui';

import primeLogoSrc from 'assets/img/primeLogo.svg';
import { useGetPools } from 'clients/api';
import { Apy } from 'components';
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
  // Replaces the default headline (Prime badge + total amount), e.g. an eligibility message
  content?: React.ReactNode;
  className?: string;
}

export const UserRewardsCard: React.FC<UserRewardsCardProps> = ({
  totalRewardsCents,
  marketRewards,
  content,
  className,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const { data: getPoolsData } = useGetPools({ accountAddress });

  const marketRewardsWithMarket = marketRewards.map(marketReward => {
    const pool = getPoolsData?.pools.find(currentPool =>
      currentPool.assets.some(poolAsset =>
        areAddressesEqual(poolAsset.vToken.underlyingToken.address, marketReward.token.address),
      ),
    );

    const asset = pool?.assets.find(poolAsset =>
      areAddressesEqual(poolAsset.vToken.underlyingToken.address, marketReward.token.address),
    );

    return { ...marketReward, asset, poolComptrollerAddress: pool?.comptrollerAddress };
  });

  return (
    <div
      className={cn(
        'flex h-58 flex-col justify-between rounded-lg bg-background-active p-4',
        className,
      )}
    >
      <div className={cn(content && 'flex flex-col gap-1')}>
        <p className="text-b1r text-light-grey">{t('primeLeaderboard.userRewards.title')}</p>

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

      <div className="flex flex-col gap-2">
        {marketRewardsWithMarket.map(({ token, rewardsCents, asset, poolComptrollerAddress }) => (
          <MarketRewardRow
            key={token.address}
            token={token}
            rewardsCents={rewardsCents}
            totalRewardsCents={totalRewardsCents}
          >
            {asset && <Apy asset={asset} type="supply" className="ml-2" />}

            {asset && poolComptrollerAddress && (
              <MarketActionsButton asset={asset} poolComptrollerAddress={poolComptrollerAddress} />
            )}
          </MarketRewardRow>
        ))}
      </div>
    </div>
  );
};
