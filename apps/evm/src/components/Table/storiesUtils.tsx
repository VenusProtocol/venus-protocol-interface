/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { bnb, lisUsd, usdc, usdt, xvs } from '__mocks__/models/tokens';

import { formatPercentageToReadableValue } from 'utilities';

import { Toggle } from '../Toggle';
import { TokenIconWithSymbol } from '../TokenIconWithSymbol';
import type { TableColumn } from './types';

export const useTableStyles = () => {
  const theme = useTheme();

  return {
    table: css`
      .table-card-content {
        grid-template-columns: 1fr 1fr 1fr;
      }

      h4 {
        display: initial;
        ${theme.breakpoints.down('lg')} {
          display: none;
        }
        ${theme.breakpoints.down('sm')} {
          display: initial;
        }
      }
    `,
    tableCss: css`
      display: initial;
      ${theme.breakpoints.down('sm')} {
        display: none;
      }
    `,
    cardsCss: css`
      display: none;
      ${theme.breakpoints.down('sm')} {
        display: initial;
      }
    `,
  };
};

export const data = [
  {
    token: lisUsd,
    apy: 0.18,
    wallet: 0,
    collateral: true,
  },
  { token: usdc, apy: 12.05, wallet: 90, collateral: false },
  { token: usdt, apy: 0.8, wallet: 160, collateral: true },
  { token: bnb, apy: 1.18, wallet: 37, collateral: false },
  { token: xvs, apy: 0.15, wallet: 160, collateral: true },
];

type Row = (typeof data)[number];

export const columns: TableColumn<Row>[] = [
  {
    key: 'asset',
    label: 'Asset',
    selectOptionLabel: 'Asset',
    renderCell: ({ token }) => <TokenIconWithSymbol token={token} />,
  },
  {
    key: 'apy',
    label: 'APY',
    selectOptionLabel: 'APY',
    renderCell: ({ apy }) => (
      <div style={{ color: '#18df8b' }}>{formatPercentageToReadableValue(apy)}</div>
    ),
  },
  {
    key: 'wallet',
    label: 'Wallet',
    selectOptionLabel: 'Wallet',
    renderCell: ({ wallet, token }) => `${wallet} ${token.symbol}`,
  },
  {
    key: 'collateral',
    label: 'Collateral',
    selectOptionLabel: 'Collateral',
    renderCell: ({ collateral }) => <Toggle onChange={console.log} value={collateral} />,
  },
];

export const orderableColumns: TableColumn<Row>[] = columns.map(column => ({
  ...column,
  sortRows:
    column.key === 'collateral'
      ? undefined
      : (rowA, rowB, direction) => {
          let comparisonValueA: string | number | boolean = rowA.token.symbol;
          let comparisonValueB: string | number | boolean = rowB.token.symbol;

          if (column.key === 'apy') {
            comparisonValueA = rowA.apy;
            comparisonValueB = rowB.apy;
          } else if (column.key === 'wallet') {
            comparisonValueA = rowA.wallet;
            comparisonValueB = rowB.wallet;
          }

          // Compare values
          if (comparisonValueA < comparisonValueB) {
            return direction === 'asc' ? -1 : 1;
          }
          if (comparisonValueA > comparisonValueB) {
            return direction === 'asc' ? 1 : -1;
          }

          return 0;
        },
}));
