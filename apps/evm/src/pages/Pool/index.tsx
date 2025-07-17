/** @jsxImportSource @emotion/react */
import { useGetPool } from 'clients/api';
import { Notice, Page, Spinner } from 'components';
import { routes } from 'constants/routing';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';

import { NULL_ADDRESS } from 'constants/address';
import { MarketTable } from 'containers/MarketTable';
import { PoolStats } from 'containers/PoolStats';
import { Redirect } from 'containers/Redirect';
import { useParams } from 'react-router';
import type { Address } from 'viem';
import { useStyles } from './styles';

const PoolPage: React.FC = () => {
  const { accountAddress } = useAccountAddress();

  const { poolComptrollerAddress = NULL_ADDRESS } = useParams<{
    poolComptrollerAddress: Address;
  }>();

  const { data: getPools, isLoading: isGetPoolLoading } = useGetPool({
    accountAddress,
    poolComptrollerAddress,
  });
  const pool = getPools?.pool;

  const styles = useStyles();
  const { t } = useTranslation();

  // Redirect to Dashboard page if pool Comptroller address is incorrect
  if (!isGetPoolLoading && !pool) {
    return <Redirect to={routes.dashboard.path} />;
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
      )}
    </Page>
  );
};

export default PoolPage;
