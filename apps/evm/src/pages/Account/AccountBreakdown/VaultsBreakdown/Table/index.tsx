import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { Table, type TableColumn, TokenIconWithSymbol } from 'components';
import { useTranslation } from 'libs/translations';
import type { Vault } from 'types';
import { convertMantissaToTokens, formatPercentageToReadableValue } from 'utilities';

import { routes } from 'constants/routing';
import { useNavigate } from 'hooks/useNavigate';

export interface VaultTableProps {
  vaults: Vault[];
}

export const VaultTable: React.FC<VaultTableProps> = ({ vaults }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigate();

  const tableColumns: TableColumn<Vault>[] = useMemo(
    () => [
      {
        accessorKey: 'asset',
        header: t('account.vaultsBreakdown.table.column.asset'),
        cell: ({ row }) => <TokenIconWithSymbol token={row.original.stakedToken} />,
      },
      {
        accessorKey: 'apr',
        accessorFn: row => row.stakingAprPercentage,
        header: t('account.vaultsBreakdown.table.column.apr'),
        cell: ({ row }) => formatPercentageToReadableValue(row.original.stakingAprPercentage),
      },
      {
        accessorFn: row => row.userStakedMantissa?.toNumber(),
        header: t('account.vaultsBreakdown.table.column.stake'),
        cell: ({ row }) =>
          convertMantissaToTokens({
            value: new BigNumber(row.original.userStakedMantissa || 0),
            token: row.original.stakedToken,

            returnInReadableFormat: true,
            addSymbol: true,
          }),
      },
    ],
    [t],
  );

  return (
    <Table
      title={t('account.vaultsBreakdown.table.title')}
      className="lg:w-[calc(50%-1rem)]"
      data={vaults}
      columns={tableColumns}
      onRowClick={() => navigate(routes.vaults.path)}
      initialState={{
        sorting: [
          {
            id: 'stake',
            desc: true,
          },
        ],
      }}
    />
  );
};

export default VaultTable;
