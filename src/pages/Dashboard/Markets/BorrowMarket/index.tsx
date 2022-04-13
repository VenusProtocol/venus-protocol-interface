/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  formatCoinsToReadableValue,
  formatCentsToReadableValue,
  formatApy,
} from 'utilities/common';
import { Asset, TokenId } from 'types';
import { Token } from 'components/v2/Token';
import { Table, ITableProps } from 'components/v2/Table';
import useUserMarketInfo from 'hooks/useUserMarketInfo';
import { AuthContext } from 'context/AuthContext';
import { useStyles } from '../styles';

export interface IBorrowMarketUiProps {
  className?: string;
  borrowAssets: Asset[];
  withXvs: boolean;
}

const columns = [
  { key: 'asset', label: 'Asset', orderable: false },
  { key: 'apy', label: 'APY', orderable: true },
  { key: 'wallet', label: 'Wallet', orderable: true },
  { key: 'liquidity', label: 'Liquidity', orderable: true },
];

export const BorrowMarketUi: React.FC<IBorrowMarketUiProps> = ({
  className,
  borrowAssets,
  withXvs,
}) => {
  const styles = useStyles();

  // Format assets to rows
  const rows: ITableProps['data'] = borrowAssets.map(asset => {
    const borrowApy = withXvs ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;

    return [
      {
        key: 'asset',
        render: () => <Token symbol={asset.name as TokenId} />,
        value: asset.name,
      },
      {
        key: 'apy',
        render: () => formatApy(borrowApy),
        value: borrowApy.toNumber(),
      },
      {
        key: 'wallet',
        render: () =>
          formatCoinsToReadableValue({
            value: asset.walletBalance,
            tokenSymbol: asset.symbol as TokenId,
          }),
        value: asset.walletBalance.toString(),
      },
      {
        key: 'liquidity',
        // Convert liquidity (expressed in dollars) to cents, then format it to
        // readable value
        render: () => formatCentsToReadableValue(asset.liquidity.multipliedBy(100)),
        value: asset.liquidity.toNumber(),
      },
    ];
  });

  return (
    <div className={className} css={styles.tableContainer}>
      <Table
        title="Borrow market"
        columns={columns}
        data={rows}
        initialOrder={{
          orderBy: 'apy',
          orderDirection: 'asc',
        }}
        rowKeyIndex={0}
      />
    </div>
  );
};

const BorrowMarket: React.FC = () => {
  const { account } = React.useContext(AuthContext);
  const userMarketInfo = useUserMarketInfo({ account: account?.address });

  // @TODO: set withXVS from WalletBalance
  return <BorrowMarketUi borrowAssets={userMarketInfo} withXvs />;
};

export default BorrowMarket;
