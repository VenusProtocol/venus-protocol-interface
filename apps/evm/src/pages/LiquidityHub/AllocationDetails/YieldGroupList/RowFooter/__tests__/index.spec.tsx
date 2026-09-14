import { screen } from '@testing-library/react';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { renderComponent } from 'testUtils/render';
import type { LiquidityHubYieldGroup } from 'types';
import { RowFooter } from '..';

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

const [liquidityHub] = liquidityHubs;
const { underlyingToken } = liquidityHub.vhToken;
const [coreYieldGroup] = liquidityHub.yieldGroups;

const renderRowFooter = (row: LiquidityHubYieldGroup) =>
  renderComponent(<RowFooter row={row} underlyingToken={underlyingToken} isOpen />);

const getColumnLabels = () =>
  screen
    .getAllByRole('columnheader')
    .map(columnHeader => columnHeader.querySelector('span')?.textContent);

describe('RowFooter', () => {
  // The shared metrics must sit in the same relative position as in the parent
  // table rendered by YieldGroupList/useColumns.
  it('lists columns in the same order as the parent table', () => {
    renderRowFooter({
      ...coreYieldGroup,
      sources: coreYieldGroup.sources.map(source => ({
        ...source,
        collaterals: [],
        lockEndDate: undefined,
      })),
    });

    expect(getColumnLabels()).toEqual(['Market', 'Alloc.', 'Liquidity', 'APY']);
  });

  it('labels the name column as a vault and appends the lock end date and collateral columns for frv groups', () => {
    renderRowFooter({
      ...coreYieldGroup,
      type: 'frv',
    });

    expect(getColumnLabels()).toEqual([
      'Vault',
      'Alloc.',
      'Liquidity',
      'APY',
      'Lock end date',
      'Collateral',
    ]);
  });
});
