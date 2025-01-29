import type { MarketTableProps } from 'containers/MarketTable';
import { useAccountAddress } from 'libs/wallet';
import { useMemo } from 'react';

export const useMarketTableColumns = () => {
  const { accountAddress } = useAccountAddress();

  return useMemo(() => {
    const columns: MarketTableProps['columns'] = [
      'asset',
      'pool',
      'labeledSupplyApy',
      'labeledBorrowApy',
    ];

    if (accountAddress) {
      columns.push('userWalletBalance');
    }

    columns.push('liquidity');

    return columns;
  }, [accountAddress]);
};
