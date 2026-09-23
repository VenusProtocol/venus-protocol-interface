import { useState } from 'react';
import type { Pool } from 'types';

// TODO: fetch from API (VPD-2071)
import { spokePools } from '__mocks__/models/spokePools';
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
  const [selectedPoolId, setSelectedPoolId] = useState(CORE_POOL_PILL_ID);

  const userHasPositions = pool.assets.some(
    asset =>
      asset.userSupplyBalanceTokens.isGreaterThan(0) ||
      asset.userBorrowBalanceTokens.isGreaterThan(0) ||
      asset.isCollateralOfUser,
  );

  const spokePoolsWithPositions =
    isSpokeEnabled && accountAddress
      ? spokePools.filter(spokePool =>
          spokePool.assets.some(
            asset =>
              asset.userSupplyBalanceTokens.isGreaterThan(0) ||
              asset.userBorrowBalanceTokens.isGreaterThan(0),
          ),
        )
      : [];

  const selectedSpokePool = spokePoolsWithPositions.find(
    spokePool => spokePool.comptrollerAddress === selectedPoolId,
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
          selectedPoolId={selectedPoolId}
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
