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
  it('renders a zero total when no mutations are provided', () => {
    const { container } = renderComponent(<ApyBreakdown pool={fakePool} />);

    expect(container.textContent).toBe('Total borrow APY0%');
  });

  it('ignores VAI mutations and offsets borrow APY against supply APY when calculating net APY', () => {
    const { container } = renderComponent(
      <ApyBreakdown
        pool={fakePool}
        simulatedPool={fakeSimulatedPool}
        balanceMutations={[
          fakeBalanceMutations[0],
          fakeBalanceMutations[1],
          fakeBalanceMutations[3],
        ]}
      />,
    );

    expect(container.textContent).toBe(
      'Supply APY0.05%Distribution APY0.11%Borrow APY-4.97%Distribution APY0.52%Net APY7.66%',
    );
  });

  it.each([
    {
      label: 'supply',
      balanceMutations: [fakeBalanceMutations[1]],
      expectedTextContent: 'Supply APY0.05%Distribution APY0.11%Total supply APY1.16%',
    },
    {
      label: 'withdraw',
      balanceMutations: [fakeBalanceMutations[2]],
      expectedTextContent:
        'Supply APY3.88%Distribution APY1.35%Prime APY0.75%1.75%Total supply APY7.99%',
    },
    {
      label: 'borrow',
      balanceMutations: [fakeBalanceMutations[3]],
      expectedTextContent: 'Borrow APY-4.97%Distribution APY0.52%Total borrow APY-6.49%',
    },
    {
      label: 'repay',
      balanceMutations: [fakeBalanceMutations[4]],
      expectedTextContent: 'Borrow APY-4.97%Distribution APY0.52%Total borrow APY-6.49%',
    },
  ] satisfies {
    label: string;
    balanceMutations: BalanceMutation[];
    expectedTextContent: string;
  }[])('renders the correct single-market breakdown for $label', props => {
    const { container } = renderComponent(
      <ApyBreakdown pool={fakePool} simulatedPool={fakeSimulatedPool} {...props} />,
    );

    expect(container.textContent).toBe(props.expectedTextContent);
  });
});
