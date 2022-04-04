/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import {
  convertWeiToCoins,
  formatCoinsToReadableValue,
  formatDollarsToReadableValue,
} from 'utilities/common';
import { TokenSymbol } from 'types';
import { CONTRACT_TOKEN_ADDRESS } from 'utilities/constants';
import { Token } from '../Token';
import { Table, ITableProps } from '../Table';
import { BorrowAsset } from './types';
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
      render: () => <Token symbol={asset.symbol} />,
      value: asset.name,
    },
    {
      key: 'apy',
      render: () => `${asset.borrowApyPercentage}%`,
      value: asset.borrowApyPercentage,
    },
    {
      key: 'wallet',
      render: () =>
        formatCoinsToReadableValue({
          value: asset.walletBalanceCoins,
          tokenSymbol: asset.symbol,
        }),
      value: asset.walletBalanceCoins.toString(),
    },
    {
      key: 'liquidity',
      render: () => formatDollarsToReadableValue(asset.liquidityCents),
      value: asset.liquidityCents.toString(),
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
  // TODO: fetch actual data
  const assetDataFromContract = [
    {
      id: '1',
      address: '1',
      symbol: 'xvs',
      borrowApy: '3.14',
      liquidity: '2151232133213',
    },
    {
      id: '2',
      address: '2',
      symbol: 'usdc',
      borrowApy: '0.14',
      liquidity: '2158192683',
    },
    {
      id: '3',
      address: '3',
      symbol: 'bnb',
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
  const assets = assetDataFromContract
    // Filter out tokens we don't support (this could happen if a new token was
    // introduced within the smart contracts and we didn't update our frontend
    // config)
    .filter(asset => !Object.prototype.hasOwnProperty.call(CONTRACT_TOKEN_ADDRESS, asset.symbol))
    .map(asset => {
      const walletToken = walletTokens.find(token => token.vToken === asset.address);

      const walletBalanceCoins =
        walletToken?.tokenBalance &&
        // Check token symbol is listed
        convertWeiToCoins({
          value: new BigNumber(walletToken.tokenBalance),
          tokenSymbol: asset.symbol as TokenSymbol,
        });

      return {
        id: asset.id,
        symbol: asset.symbol as TokenSymbol,
        name: asset.symbol.toUpperCase(),
        walletBalanceCoins: walletBalanceCoins || new BigNumber(0),
        borrowApyPercentage: +asset.borrowApy,
        liquidityCents: new BigNumber(asset.liquidity),
      };
    });

  return <BorrowMarketUi borrowAssets={assets} />;
};

export default BorrowMarket;
