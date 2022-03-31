/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { CONTRACT_TOKEN_ADDRESS } from 'utilities/constants';
import { BorrowAsset } from './types';
import { Table, ITableProps } from '../Table';
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
  const assetDataFromContract = [
    {
      id: '1',
      address: '1',
      name: 'xvs',
      borrowApy: '3.14',
      liquidity: '2151232133213',
    },
    {
      id: '2',
      address: '2',
      name: 'usdc',
      borrowApy: '0.14',
      liquidity: '2158192683',
    },
    {
      id: '3',
      address: '3',
      name: 'bnb',
      borrowApy: '8.14',
      liquidity: '918723',
    },
  ];

  const walletTokens = [
    {
      vToken: '1', // This corresponds to the address of the token (check out VTokenBalances struct on VenusLens contract)
      tokenBalance: '1682312',
    },
    {
      vToken: '2',
      tokenBalance: '918923126i37132',
    },
    {
      vToken: '3',
      tokenBalance: '0',
    },
  ];

  // Format fetched data into borrow assets
  const assets = assetDataFromContract.map(asset => {
    const walletToken = walletTokens.find(token => token.vToken === asset.address);

    // Find corresponding token information
    const tokenDecimals =
      CONTRACT_TOKEN_ADDRESS[asset.name as keyof typeof CONTRACT_TOKEN_ADDRESS]?.decimals;

    const walletBalanceCoins =
      walletToken?.tokenBalance && tokenDecimals
        ? new BigNumber(walletToken?.tokenBalance).multipliedBy(
            new BigNumber(10).pow(tokenDecimals),
          )
        : new BigNumber(0);

    return {
      id: asset.id,
      name: asset.name,
      walletBalanceCoins,
      borrowApyPercentage: +asset.borrowApy,
      liquidityCents: new BigNumber(asset.liquidity),
    };
  });

  return <BorrowMarketUi borrowAssets={assets} />;
};

export default BorrowMarket;
