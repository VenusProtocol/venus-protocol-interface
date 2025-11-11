import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import type { BalanceMutation, Pool, TokenDistribution } from 'types';
import { ApyBreakdown } from '..';

const bumpTokenDistributions = ({
  tokenDistributions,
}: { tokenDistributions: TokenDistribution[] }) =>
  tokenDistributions.map(distribution => ({
    ...distribution,
    apyPercentage: distribution.apyPercentage.plus(1),
  }));

const fakePool = poolData[0];

const fakeSimulatedPool: Pool = {
  ...fakePool,
  assets: fakePool.assets.map(a => ({
    ...a,
    supplyTokenDistributions: bumpTokenDistributions({
      tokenDistributions: a.supplyTokenDistributions,
    }),
    borrowTokenDistributions: bumpTokenDistributions({
      tokenDistributions: a.borrowTokenDistributions,
    }),
  })),
};

const fakeBalanceMutations: BalanceMutation[] = [
  {
    type: 'vai',
    amountTokens: new BigNumber(10),
    action: 'borrow',
  },
  {
    type: 'asset',
    vTokenAddress: fakeSimulatedPool.assets[0].vToken.address,
    amountTokens: new BigNumber(10),
    action: 'supply',
  },
  {
    type: 'asset',
    vTokenAddress: fakeSimulatedPool.assets[1].vToken.address,
    amountTokens: new BigNumber(1),
    action: 'withdraw',
  },
  {
    type: 'asset',
    vTokenAddress: fakeSimulatedPool.assets[2].vToken.address,
    amountTokens: new BigNumber(4),
    action: 'borrow',
  },
  {
    type: 'asset',
    vTokenAddress: fakeSimulatedPool.assets[2].vToken.address,
    amountTokens: new BigNumber(2),
    action: 'repay',
  },
];

describe('ApyBreakdown', () => {
  it.each([
    { label: 'no mutations', simulatedPool: undefined, balanceMutations: undefined },
    // Actions concerning multiple markets
    {
      label: 'multiple mutations',
      simulatedPool: fakeSimulatedPool,
      balanceMutations: [fakeBalanceMutations[0], fakeBalanceMutations[1], fakeBalanceMutations[3]],
    },
    // Supply to one market
    {
      label: 'supply',
      simulatedPool: fakeSimulatedPool,
      balanceMutations: [fakeBalanceMutations[1]],
    },
    // Withdraw to one market
    {
      label: 'withdraw',
      simulatedPool: fakeSimulatedPool,
      balanceMutations: [fakeBalanceMutations[2]],
    },
    // Borrow from one market
    {
      label: 'borrow',
      simulatedPool: fakeSimulatedPool,
      balanceMutations: [fakeBalanceMutations[3]],
    },
    // Repay to one market
    {
      label: 'repay',
      simulatedPool: fakeSimulatedPool,
      balanceMutations: [fakeBalanceMutations[4]],
    },
  ] satisfies {
    label: string;
    simulatedPool?: Pool;
    balanceMutations?: BalanceMutation[];
  }[])('renders correct values: $label', async props => {
    const { container } = renderComponent(<ApyBreakdown pool={fakePool} {...props} />);

    expect(container.textContent).toMatchSnapshot();
  });
});
