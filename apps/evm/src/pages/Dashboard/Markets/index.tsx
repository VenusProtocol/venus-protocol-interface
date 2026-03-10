import type { Pool } from 'types';

import { TopMarkets } from 'containers/TopMarkets';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useTranslation } from 'libs/translations';
import { Placeholder } from '../Placeholder';
import { Positions } from './Positions';

export interface MarketsProps {
  pool: Pool;
}

export const Markets: React.FC<MarketsProps> = ({ pool }) => {
  const { t } = useTranslation();
  const { marketsPagePath } = useGetMarketsPagePath();

  const userHasPositions = pool.assets.some(
    asset =>
      asset.userSupplyBalanceTokens.isGreaterThan(0) ||
      asset.userBorrowBalanceTokens.isGreaterThan(0) ||
      asset.isCollateralOfUser,
  );

  return (
    <>
      {userHasPositions ? (
        <Positions pools={[pool]} />
      ) : (
        <Placeholder
          iconName="venus"
          title={t('account.pools.placeholder.title')}
          to={marketsPagePath}
          buttonSize="sm"
        />
      )}
      <TopMarkets variant="secondary" className="mb-3 mt-6" />
    </>
  );
};
