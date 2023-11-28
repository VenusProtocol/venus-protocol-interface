/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import { useGetPool } from 'clients/api';
import { Cell, CellGroup, Notice, Spinner } from 'components';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { routes } from 'constants/routing';
import { useTranslation } from 'packages/translations';
import { useAccountAddress } from 'packages/wallet';
import { Pool } from 'types';
import { formatCentsToReadableValue } from 'utilities';

import Table from './Table';
import { useStyles } from './styles';

export interface PoolUiProps {
  pool?: Pool;
}

export const PoolUi: React.FC<PoolUiProps> = ({ pool }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const cells: Cell[] = useMemo(() => {
    const { totalSupplyCents, totalBorrowCents } = (pool?.assets || []).reduce(
      (acc, item) => ({
        totalSupplyCents: acc.totalSupplyCents.plus(item.supplyBalanceCents),
        totalBorrowCents: acc.totalBorrowCents.plus(item.borrowBalanceCents),
      }),
      {
        totalSupplyCents: new BigNumber(0),
        totalBorrowCents: new BigNumber(0),
      },
    );

    return [
      {
        label: t('pool.header.totalSupplyLabel'),
        value: formatCentsToReadableValue({
          value: totalSupplyCents,
        }),
      },
      {
        label: t('pool.header.totalBorrowLabel'),
        value: formatCentsToReadableValue({
          value: totalBorrowCents,
        }),
      },
      {
        label: t('pool.header.availableLiquidityLabel'),
        value: formatCentsToReadableValue({
          value: totalSupplyCents.minus(totalBorrowCents),
        }),
      },
      {
        label: t('pool.header.assetsLabel'),
        value: pool?.assets.length || PLACEHOLDER_KEY,
      },
    ];
  }, [pool, t]);

  return pool ? (
    <>
      <CellGroup cells={cells} css={styles.header} />

      {pool.isIsolated && (
        <Notice
          css={styles.isolatedPoolWarning}
          variant="warning"
          description={t('pool.isolatedPoolWarning')}
        />
      )}

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
