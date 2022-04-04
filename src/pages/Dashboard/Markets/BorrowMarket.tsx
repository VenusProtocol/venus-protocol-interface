/** @jsxImportSource @emotion/react */
import React from 'react';
import {
  formatCoinsToReadableValue,
  formatDollarsToReadableValue,
  getBigNumber,
  formatApy,
} from 'utilities/common';
import { Asset, TokenSymbol } from 'types';
import { CONTRACT_TOKEN_ADDRESS } from 'utilities/constants';
import { Token } from 'components/v2/Token';
import { Table, ITableProps } from 'components/v2/Table';
import { useStyles } from './styles';

export interface IBorrowMarketUiProps {
  className?: string;
  borrowAssets: Asset[];
  withXVS: boolean;
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
  withXVS,
}) => {
  const styles = useStyles();

  // Format assets to rows
  const rows: ITableProps['data'] = borrowAssets.map(asset => [
    {
      key: 'asset',
      render: () => <Token symbol={asset.symbol as TokenSymbol} />,
      value: asset.name,
    },
    {
      key: 'apy',
      render: () => {
        const apy = withXVS
          ? getBigNumber(asset.xvsBorrowApy).plus(asset.borrowApy)
          : asset.borrowApy;
        return formatApy(apy);
      },
      value: asset.borrowApy.toString(),
    },
    {
      key: 'wallet',
      render: () =>
        formatCoinsToReadableValue({
          value: asset.walletBalance,
          tokenSymbol: asset.symbol as TokenSymbol,
        }),
      value: asset.walletBalance.toString(),
    },
    {
      key: 'liquidity',
      render: () => formatDollarsToReadableValue(asset.liquidity),
      value: asset.liquidity.toString(),
    },
  ]);

  return (
    <div className={className} css={styles.container}>
      <Table
        title="Borrow market"
        columns={columns}
        data={rows}
        initialOrder={{
          orderBy: 'apy',
          orderDirection: 'asc',
        }}
      />
    </div>
  );
};

const BorrowMarket: React.FC = () => {
  // Format fetched data into borrow assets
  // @TODO: fetch actual data
  const assets = require('./mocks') // eslint-disable-line
    .assetData// Filter out tokens we don't support (this could happen if a new token was
    // introduced within the smart contracts and we didn't update our frontend
    // config)
    .filter(
      (asset: Asset) => !Object.prototype.hasOwnProperty.call(CONTRACT_TOKEN_ADDRESS, asset.symbol),
    );
  // @TODO: set withXVS from WalletBalance
  return <BorrowMarketUi borrowAssets={assets} withXVS />;
};

export default BorrowMarket;
