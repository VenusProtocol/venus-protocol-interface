/** @jsxImportSource @emotion/react */
import { useGetPool } from 'clients/api';
import { EModeBanner, Page, Spinner } from 'components';
import { useAccountAddress } from 'libs/wallet';

import { NULL_ADDRESS } from 'constants/address';
import { MarketTable } from 'containers/MarketTable';
import { PoolStats } from 'containers/PoolStats';
import { Redirect } from 'containers/Redirect';
import { useGetHomePagePath } from 'hooks/useGetHomePagePath';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useParams } from 'react-router';
import type { Address } from 'viem';
import { useStyles } from './styles';

const PoolPage: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { homePagePath } = useGetHomePagePath();
  const isEModeFeatureEnabled = useIsFeatureEnabled({
    name: 'eMode',
  });

  // TODO: only display E-mode banner if pool has E-mode groups available
  const shouldShowEModeBanner = isEModeFeatureEnabled;

  // TODO: fetch e-mode group
  const enabledEModeGroup = {
    name: 'Stablecoins',
    description: 'This block contains the assets of this category',
  };

  const { poolComptrollerAddress = NULL_ADDRESS } = useParams<{
    poolComptrollerAddress: Address;
  }>();

  const { data: getPools, isLoading: isGetPoolLoading } = useGetPool({
    accountAddress,
    poolComptrollerAddress,
  });
  const pool = getPools?.pool;

  const styles = useStyles();

  // Redirect to home page if pool Comptroller address is incorrect
  if (!isGetPoolLoading && !pool) {
    return <Redirect to={homePagePath} />;
  }

  return (
    <Page indexWithSearchEngines={false}>
      {pool ? (
        <>
          <PoolStats
            pools={[pool]}
            stats={['supply', 'borrow', 'liquidity', 'assetCount']}
            css={styles.header}
          />

          {shouldShowEModeBanner && (
            <EModeBanner
              poolComptrollerContractAddress={pool.comptrollerAddress}
              className="mb-6"
              enabledEModeGroup={enabledEModeGroup}
            />
          )}

          <MarketTable
            pools={[pool]}
            breakpoint="lg"
            columns={[
              'asset',
              'supplyBalance',
              'labeledSupplyApy',
              'borrowBalance',
              'labeledBorrowApy',
              'liquidity',
            ]}
            initialOrder={{
              orderBy: 'labeledSupplyApy',
              orderDirection: 'desc',
            }}
          />
        </>
      ) : (
        <Spinner />
      )}
    </Page>
  );
};

export default PoolPage;
