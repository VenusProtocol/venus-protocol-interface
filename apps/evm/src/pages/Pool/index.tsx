/** @jsxImportSource @emotion/react */
import { Navigate } from 'react-router-dom';

import { useGetPool } from 'clients/api';
import { Notice, Spinner } from 'components';
import { routes } from 'constants/routing';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import type { Pool } from 'types';

import { PoolStats } from 'containers/PoolStats';
import Table from './Table';
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

      <Table pool={pool} />
    </>
  ) : (
    <Spinner />
  );
};

interface PoolPageProps {
  poolComptrollerAddress: string;
}

const PoolPage: React.FC<PoolPageProps> = ({ poolComptrollerAddress }) => {
  const { accountAddress } = useAccountAddress();

  const { data: getPoolData, isLoading: isGetPoolLoading } = useGetPool({
    accountAddress,
    poolComptrollerAddress,
  });

  // Redirect to Dashboard page if pool Comptroller address is incorrect
  if (!isGetPoolLoading && !getPoolData?.pool) {
    return <Navigate to={routes.dashboard.path} />;
  }

  return <PoolUi pool={getPoolData?.pool} />;
};

export default PoolPage;
