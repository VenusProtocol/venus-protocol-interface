/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { Cell, CellGroup, Notice, Spinner } from 'components';
import React, { useMemo } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { formatCentsToReadableValue, getContractAddress } from 'utilities';

import { useGetPool } from 'clients/api';
import PLACEHOLDER_KEY from 'constants/placeholderKey';
import { routes } from 'constants/routing';
import { useAuth } from 'context/AuthContext';

import Table from './Table';
import { useStyles } from './styles';

const MAIN_POOL_COMPTROLLER_ADDRESS = getContractAddress('comptroller');

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
  }, [pool]);

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
  const { accountAddress } = useAuth();

  const { data: getPoolData, isLoading: isGetPoolLoading } = useGetPool({
    accountAddress,
    poolComptrollerAddress,
  });

  // Redirect to Dashboard page if pool Comptroller address is incorrect
  if (!isGetPoolLoading && !getPoolData?.pool) {
    return <Redirect to={routes.dashboard.path} />;
  }

  return <PoolUi pool={getPoolData?.pool} />;
};

export type CorePoolPageProps = RouteComponentProps;

export const CorePool: React.FC<CorePoolPageProps> = () => (
  <PoolPage poolComptrollerAddress={MAIN_POOL_COMPTROLLER_ADDRESS} />
);

export type IsolatedPoolPageProps = RouteComponentProps<{ poolComptrollerAddress: string }>;

export const IsolatedPool: React.FC<IsolatedPoolPageProps> = ({
  match: {
    params: { poolComptrollerAddress },
  },
}) => <PoolPage poolComptrollerAddress={poolComptrollerAddress} />;
