/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import { ComponentMeta } from '@storybook/react';
import { withCenterStory, withThemeProvider } from 'stories/decorators';
import { formatToReadablePercentage } from 'utilities/common';
import { getToken } from 'utilities';
import { TokenId } from 'types';
import { Toggle } from 'components';
import { Table } from '.';
import { Icon } from '../Icon';

const styles = {
  asset: css`
    display: flex;
    align-items: center;
    img {
      height: 18px;
      width: 18px;
      margin-right: 4px;
    }
    span {
      display: flex;
      justify-self: flex-end;
    }
  `,
  apy: css`
    color: #18df8b;
    svg {
      margin-right: 12px;
      fill: #18df8b;
    }
  `,
};

function createData(asset: TokenId, apy: number, wallet: number, collateral: boolean) {
  return [
    {
      key: 'asset',
      value: asset,
      render: () => (
        <div css={styles.asset}>
          <img src={getToken(asset).asset} alt={asset} />
          <span>{asset.toUpperCase()}</span>
        </div>
      ),
    },
    {
      key: 'apy',
      value: apy,
      render: () => (
        <div css={styles.apy}>
          <Icon name="longArrow" size="12px" />
          {formatToReadablePercentage(apy)} {asset.toUpperCase()}
        </div>
      ),
    },
    { key: 'wallet', value: wallet, render: () => `${wallet} ${asset}` },
    {
      key: 'collateral',
      value: collateral,
      render: () => <Toggle onChange={console.log} value={collateral} />,
    },
  ];
}

const rows = [
  createData('sxp', 0.18, 0, true),
  createData('usdc', 12.05, 90, false),
  createData('usdt', 0.8, 160, true),
  createData('bnb', 1.18, 37, false),
  createData('xvs', 0.15, 160, true),
];

const columns = [
  { key: 'asset', label: 'Asset', orderable: false },
  { key: 'apy', label: 'APY', orderable: true },
  { key: 'wallet', label: 'Wallet', orderable: true },
  { key: 'Collateral', label: 'Collateral', orderable: true },
];

export default {
  title: 'Components/Table',
  component: Table,
  decorators: [withCenterStory({ width: 800 }), withThemeProvider],
  parameters: {
    backgrounds: {
      default: 'White',
    },
  },
} as ComponentMeta<typeof Table>;

export const TableDefault = () => (
  <Table columns={columns} data={rows} title="Market Data" minWidth="650px" rowKeyIndex={0} />
);

export const WithInitialOrderDefault = () => (
  <Table
    columns={columns}
    data={rows}
    title="Market Data"
    minWidth="650px"
    initialOrder={{
      orderBy: 'apy',
      orderDirection: 'desc',
    }}
    rowKeyIndex={0}
  />
);

export const WithCustomColumnsWidth = () => (
  <Table
    columns={columns}
    data={rows}
    title="Market Data"
    rowKeyIndex={0}
    gridTemplateColumns="100px 1fr 1fr 140px"
  />
);
