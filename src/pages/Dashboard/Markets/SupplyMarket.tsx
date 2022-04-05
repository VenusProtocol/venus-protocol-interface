/** @jsxImportSource @emotion/react */
import React from 'react';
import { formatCoinsToReadableValue, formatApy } from 'utilities/common';
import { Asset, TokenSymbol } from 'types';
import { CONTRACT_TOKEN_ADDRESS } from 'utilities/constants';
import { Token, Toggle } from 'components';
import { Table, ITableProps } from 'components/v2/Table';
import { useStyles } from './styles';

export interface ISupplyMarketUiProps {
  className?: string;
  assets: Asset[];
  withXvs: boolean;
  toggleAssetCollateral: (tokenSymbol: TokenSymbol) => void;
}

const columns = [
  { key: 'asset', label: 'Asset', orderable: false },
  { key: 'apy', label: 'APY', orderable: true },
  { key: 'wallet', label: 'Wallet', orderable: true },
  { key: 'collateral', label: 'Collateral', orderable: true },
];

export const SupplyMarketUi: React.FC<ISupplyMarketUiProps> = ({
  className,
  assets,
  toggleAssetCollateral,
  withXvs,
}) => {
  const styles = useStyles();

  // Format assets to rows
  const rows: ITableProps['data'] = assets.map(asset => [
    {
      key: 'asset',
      render: () => <Token symbol={asset.symbol as TokenSymbol} />,
      value: asset.name,
    },
    {
      key: 'apy',
      render: () => {
        const apy = withXvs ? asset.xvsBorrowApy.plus(asset.borrowApy) : asset.borrowApy;
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
      key: asset.collateral.toString(),
      value: asset.collateral,
      render: () =>
        +asset.collateralFactor.toString() ? (
          <Toggle
            onChange={() => toggleAssetCollateral(asset.id as TokenSymbol)}
            value={asset.collateral}
          />
        ) : null,
    },
  ]);

  return (
    <div className={className} css={styles.container}>
      <Table
        title="Supply market"
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

const SupplyMarket: React.FC = () => {
  // Format fetched data into borrow assets
  // @TODO: fetch actual data
  const assets = require('./mocks') // eslint-disable-line
    .assetData // Filter out tokens we don't support (this could happen if a new token was
    // introduced within the smart contracts and we didn't update our frontend
    // config)
    .filter(
      (asset: Asset) => !Object.prototype.hasOwnProperty.call(CONTRACT_TOKEN_ADDRESS, asset.symbol),
    );
  // @TODO: set withXVS from WalletBalance
  return <SupplyMarketUi assets={assets} withXvs toggleAssetCollateral={() => {}} />;
};

export default SupplyMarket;
