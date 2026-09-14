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
  screen.getAllByRole('columnheader').map(columnHeader => columnHeader.textContent);

describe('RowFooter', () => {
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

  it('appends the lock end date and collateral columns after the shared ones', () => {
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
