/** @jsxImportSource @emotion/react */
import React from 'react';

import { BorrowAsset } from './types';
import { Table, ITableProps } from '../Table';
import formatToBorrowAsset, { TempAssetFromContract } from './formatToBorrowAsset';
import { useStyles } from './styles';

export * from './types';

export interface IBorrowMarketUiProps {
  className?: string;
  borrowAssets: BorrowAsset[];
}

const columns = [
  { key: 'asset', label: 'Asset', orderable: false },
  { key: 'apy', label: 'APY', orderable: true },
  { key: 'wallet', label: 'Wallet', orderable: true },
  { key: 'liquidity', label: 'Liquidity', orderable: true },
];

export const BorrowMarketUi: React.FC<IBorrowMarketUiProps> = ({ className, borrowAssets }) => {
  const styles = useStyles();

  // Format assets to rows
  const rows: ITableProps['data'] = borrowAssets.map(asset => [
    {
      key: 'asset',
      // TODO: render icon
      render: () => asset.name,
      value: asset.name,
    },
    {
      key: 'apy',
      // TODO: render icon
      render: () => `${asset.borrowApyPercentage}%`,
      value: asset.borrowApyPercentage,
    },
    {
      key: 'wallet',
      // TODO: render icon
      render: () => asset.name,
      value: asset.name,
    },
    {
      key: 'liquidity',
      // TODO: render icon
      render: () => asset.name,
      value: asset.name,
    },
  ]);

  return (
    <div className={className} css={styles.container}>
      {/* TODO: add loading state */}

      {/* TODO: add error state */}

      <Table title="Borrow market" columns={columns} data={rows} />
    </div>
  );
};

const BorrowMarket: React.FC = () => {
  // TODO: fetch actual data
  const data: TempAssetFromContract[] = [];

  // Format fetched data into borrow assets
  const assets = data.map(formatToBorrowAsset);

  return <BorrowMarketUi borrowAssets={assets} />;
};

export default BorrowMarket;
