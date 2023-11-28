/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { Table, TableProps, TokenIconWithSymbol } from 'components';
import { routes } from 'constants/routing';
import { useTranslation } from 'packages/translations';
import { Vault } from 'types';
import {
  compareBigNumbers,
  compareNumbers,
  convertMantissaToTokens,
  formatPercentageToReadableValue,
} from 'utilities';

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
        selectOptionLabel: t('account.vaultsBreakdown.table.column.asset'),
        renderCell: vault => <TokenIconWithSymbol token={vault.stakedToken} />,
      },
      {
        key: 'apr',
        label: t('account.vaultsBreakdown.table.column.apr'),
        selectOptionLabel: t('account.vaultsBreakdown.table.column.apr'),
        renderCell: vault => formatPercentageToReadableValue(vault.stakingAprPercentage),
        sortRows: (rowA, rowB, direction) =>
          compareNumbers(rowA.stakingAprPercentage, rowB.stakingAprPercentage, direction),
      },
      {
        key: 'stake',
        label: t('account.vaultsBreakdown.table.column.stake'),
        selectOptionLabel: t('account.vaultsBreakdown.table.column.stake'),
        renderCell: vault =>
          convertMantissaToTokens({
            value: new BigNumber(vault.userStakedMantissa || 0),
            token: vault.stakedToken,

            returnInReadableFormat: true,
            addSymbol: true,
          }),
        sortRows: (rowA, rowB, direction) =>
          compareBigNumbers(rowA.userStakedMantissa, rowB.userStakedMantissa, direction),
      },
    ],
    [t],
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
