import { useState } from 'react';
import type { Pool } from 'types';

import { useGetSpokePools } from 'clients/api';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { Placeholder } from '../Placeholder';
import { IsolatedPoolsDeprecationNotice } from './IsolatedPoolsDeprecationNotice';
import { PoolPills } from './PoolPills';
import { Positions } from './Positions';
import { SpokePositions } from './SpokePositions';

const CORE_POOL_PILL_ID = 'core';

export interface MarketsProps {
  pool: Pool;
}

export const Markets: React.FC<MarketsProps> = ({ pool }) => {
  const { t } = useTranslation();
  const { marketsPagePath } = useGetMarketsPagePath();
  const isSpokeEnabled = useIsFeatureEnabled({ name: 'spoke' });
  const { accountAddress } = useAccountAddress();
  const [selectedPoolId, setSelectedPoolId] = useState<string>();

  const userHasPositions = pool.assets.some(
    asset =>
      asset.userSupplyBalanceTokens.isGreaterThan(0) ||
      asset.userBorrowBalanceTokens.isGreaterThan(0) ||
      asset.isCollateralOfUser,
  );

  const { data: getSpokePoolsData } = useGetSpokePools(
    { accountAddress },
    { enabled: !!accountAddress },
  );

  const spokePoolsWithPositions =
    isSpokeEnabled && accountAddress
      ? (getSpokePoolsData?.spokePools ?? []).filter(spokePool =>
          spokePool.assets.some(
            asset =>
              asset.userSupplyBalanceTokens.isGreaterThan(0) ||
              asset.userBorrowBalanceTokens.isGreaterThan(0),
          ),
        )
      : [];

  const isSelectedPoolListed =
    selectedPoolId === CORE_POOL_PILL_ID ||
    spokePoolsWithPositions.some(spokePool => spokePool.comptrollerAddress === selectedPoolId);

  const activePoolId =
    selectedPoolId && isSelectedPoolListed
      ? selectedPoolId
      : userHasPositions || spokePoolsWithPositions.length === 0
        ? CORE_POOL_PILL_ID
        : spokePoolsWithPositions[0].comptrollerAddress;

  const selectedSpokePool = spokePoolsWithPositions.find(
    spokePool => spokePool.comptrollerAddress === activePoolId,
  );

  if (!userHasPositions && spokePoolsWithPositions.length === 0) {
    return (
      <>
        <IsolatedPoolsDeprecationNotice className="mb-4" />

        <Placeholder
          iconName="venus"
          title={t('account.pools.placeholder.title')}
          to={marketsPagePath}
          buttonSize="sm"
        />
      </>
    );
  }

  return (
    <>
      <IsolatedPoolsDeprecationNotice className="mb-4" />

      {spokePoolsWithPositions.length > 0 && (
        <PoolPills
          className="mb-6"
          selectedPoolId={activePoolId}
          onChange={setSelectedPoolId}
          pools={[
            { id: CORE_POOL_PILL_ID, name: t('account.spoke.corePoolPill') },
            ...spokePoolsWithPositions.map(spokePool => ({
              id: spokePool.comptrollerAddress,
              name: spokePool.name,
              healthFactor: spokePool.userHealthFactor,
            })),
          ]}
        />
      )}

      {selectedSpokePool && <SpokePositions spokePool={selectedSpokePool} />}

      {!selectedSpokePool && userHasPositions && <Positions pools={[pool]} />}

      {!selectedSpokePool && !userHasPositions && (
        <Placeholder
          iconName="venus"
          title={t('account.pools.placeholder.title')}
          to={marketsPagePath}
          buttonSize="sm"
        />
      )}
    </>
  );
};
