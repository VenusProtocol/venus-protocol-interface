/** @jsxImportSource @emotion/react */
import { useGetPool } from 'clients/api';
import { Notice, Page, Spinner } from 'components';
import { routes } from 'constants/routing';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Pool } from 'types';

import { MarketTable } from 'containers/MarketTable';
import { PoolStats } from 'containers/PoolStats';
import { Redirect } from 'containers/Redirect';
import type { Address } from 'viem';
import { useStyles } from './styles';

export interface PoolUiProps {
  pool?: Pool;
}

export const PoolUi: React.FC<PoolUiProps> = ({ pool }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return pool ? (
    <>
      <PoolStats
        pools={[pool]}
        stats={['supply', 'borrow', 'liquidity', 'assetCount']}
        css={styles.header}
      />

      <Notice
        css={styles.poolWarning}
        variant="warning"
        description={t('pool.poolWarning', { poolName: pool.name })}
      />

      <MarketTable
        pools={[pool]}
        breakpoint="xl"
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
  );
};

interface PoolPageProps {
  poolComptrollerAddress: Address;
}

const PoolPage: React.FC<PoolPageProps> = ({ poolComptrollerAddress }) => {
  const { accountAddress } = useAccountAddress();

  const { data: getPools, isLoading: isGetPoolLoading } = useGetPool({
    accountAddress,
    poolComptrollerAddress,
  });

  // Redirect to Dashboard page if pool Comptroller address is incorrect
  if (!isGetPoolLoading && !getPools?.pool) {
    return <Redirect to={routes.dashboard.path} />;
  }

  return (
    <Page indexWithSearchEngines={false}>
      <PoolUi pool={getPools?.pool} />
    </Page>
  );
};

export default PoolPage;
