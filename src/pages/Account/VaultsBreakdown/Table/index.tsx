/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { Table, TableProps, TokenIconWithSymbol } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Vault } from 'types';
import {
  compareBigNumbers,
  compareNumbers,
  convertWeiToTokens,
  formatToReadablePercentage,
} from 'utilities';

import { routes } from 'constants/routing';

import { useStyles } from './styles';

export interface VaultTableProps {
  vaults: Vault[];
}

export const VaultTable: React.FC<VaultTableProps> = ({ vaults }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const tableColumns: TableProps<Vault>['columns'] = useMemo(
    () => [
      {
        key: 'asset',
        label: t('account.vaultsBreakdown.table.column.asset'),
        renderCell: vault => <TokenIconWithSymbol token={vault.stakedToken} />,
      },
      {
        key: 'apr',
        label: t('account.vaultsBreakdown.table.column.apr'),
        renderCell: vault => formatToReadablePercentage(vault.stakingAprPercentage),
        sortRows: (rowA, rowB, direction) =>
          compareNumbers(rowA.stakingAprPercentage, rowB.stakingAprPercentage, direction),
      },
      {
        key: 'stake',
        label: t('account.vaultsBreakdown.table.column.stake'),
        renderCell: vault =>
          convertWeiToTokens({
            valueWei: new BigNumber(vault.userStakedWei || 0),
            token: vault.stakedToken,

            returnInReadableFormat: true,
            addSymbol: true,
          }),
        sortRows: (rowA, rowB, direction) =>
          compareBigNumbers(rowA.userStakedWei, rowB.userStakedWei, direction),
      },
    ],
    [vaults],
  );

  return (
    <Table
      css={styles.table}
      title={t('account.vaultsBreakdown.table.title')}
      data={vaults}
      columns={tableColumns}
      rowKeyExtractor={row =>
        `account-vaults-breakdown-table-item-${row.stakedToken.address}-${
          row.rewardToken.address
        }-${row.poolIndex || 0}-${row.lockingPeriodMs || 0}`
      }
      initialOrder={{
        orderBy: tableColumns[2], // Order by stake initially
        orderDirection: 'desc',
      }}
      getRowHref={() => routes.vaults.path}
      breakpoint="xs"
    />
  );
};

export default VaultTable;
