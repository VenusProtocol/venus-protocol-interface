import type { Pool } from 'types';

import { routes } from 'constants/routing';
import { useTranslation } from 'libs/translations';
import { Placeholder } from '../../Placeholder';
import { PoolPositions } from '../../PoolPositions';

export interface PoolsProps {
  pools: Pool[];
}

export const Pools: React.FC<PoolsProps> = ({ pools }) => {
  const { t } = useTranslation();

  // Filter out pools user has not supplied in or borrowed from, unless they have assets enabled as
  // collateral in that pool
  const filteredPools = pools.filter(pool =>
    pool.assets.some(
      asset =>
        asset.userSupplyBalanceTokens.isGreaterThan(0) ||
        asset.userBorrowBalanceTokens.isGreaterThan(0) ||
        asset.isCollateralOfUser,
    ),
  );

  if (filteredPools.length === 0) {
    return (
      <Placeholder
        iconName="venus"
        title={t('account.pools.placeholder.title')}
        description={t('account.pools.placeholder.description')}
        to={routes.pools.path}
      />
    );
  }

  return <PoolPositions pools={filteredPools} />;
};
