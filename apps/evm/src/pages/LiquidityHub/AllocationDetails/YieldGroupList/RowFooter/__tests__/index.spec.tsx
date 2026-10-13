import { screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { t } from 'libs/translations';
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

  // The API returns sources in no particular order, so the group has to order them itself when it
  // opens, in both the table and the card list it swaps to on narrower viewports
  it('sorts sources by descending APY', () => {
    const [sourceA, sourceB] = coreYieldGroup.sources;

    renderRowFooter({
      ...coreYieldGroup,
      sources: [
        { ...sourceA, name: 'Lowest APY', supplyApyPercentage: new BigNumber(1.1) },
        { ...sourceB, name: 'Highest APY', supplyApyPercentage: new BigNumber(9.9) },
      ],
    });

    // Both views are in the DOM at once, so this reads as one pair of names per view
    const renderedNames = screen
      .getAllByText(/^(Highest|Lowest) APY$/)
      .map(sourceNameDom => sourceNameDom.textContent);

    expect(renderedNames.length).toBeGreaterThan(0);
    expect(renderedNames.length % 2).toBe(0);

    for (let index = 0; index < renderedNames.length; index += 2) {
      expect(renderedNames.slice(index, index + 2)).toEqual(['Highest APY', 'Lowest APY']);
    }
  });

  it('sorts by the APY the user sees, so rewards can outrank a higher base APY', () => {
    const [sourceA, sourceB] = coreYieldGroup.sources;

    renderRowFooter({
      ...coreYieldGroup,
      sources: [
        {
          ...sourceA,
          name: 'Higher base APY',
          supplyApyPercentage: new BigNumber(5),
          supplyTokenDistributions: [],
        },
        {
          ...sourceB,
          name: 'Lower base APY with rewards',
          supplyApyPercentage: new BigNumber(4),
          supplyTokenDistributions: [
            {
              type: 'venus',
              token: underlyingToken,
              apyPercentage: new BigNumber(2),
              dailyDistributedTokens: new BigNumber(1),
              isActive: true,
            },
          ],
        },
      ],
    });

    const renderedNames = screen
      .getAllByText(/^(Higher base APY|Lower base APY with rewards)$/)
      .map(sourceNameDom => sourceNameDom.textContent);

    expect(renderedNames.length).toBeGreaterThan(0);
    expect(renderedNames.length % 2).toBe(0);

    for (let index = 0; index < renderedNames.length; index += 2) {
      expect(renderedNames.slice(index, index + 2)).toEqual([
        'Lower base APY with rewards',
        'Higher base APY',
      ]);
    }
  });

  it('renders the lock end date above its time', () => {
    renderRowFooter({
      ...coreYieldGroup,
      type: 'frv',
    });

    const [{ lockEndDate }] = coreYieldGroup.sources;

    const dateDoms = screen.getAllByText(
      t('liquidityHub.allocationDetails.yieldGroup.lockEndDateColumn.date', { date: lockEndDate }),
    );

    expect(dateDoms.length).toBeGreaterThan(0);

    for (const dateDom of dateDoms) {
      expect(dateDom.nextElementSibling).toHaveTextContent(
        t('liquidityHub.allocationDetails.yieldGroup.lockEndDateColumn.time', {
          date: lockEndDate,
        }),
      );
    }
  });
});
