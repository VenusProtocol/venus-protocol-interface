import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import type { TokenDistribution } from 'types';
import { ApyBreakdown, type ApyBreakdownItem } from '..';

const bumpTokenDistributions = ({
  tokenDistributions,
}: { tokenDistributions: TokenDistribution[] }) =>
  tokenDistributions.map(distribution => ({
    ...distribution,
    apyPercentage: distribution.apyPercentage.plus(1),
  }));

const fakeAssets = poolData[0].assets;

const supplyItem: ApyBreakdownItem = {
  type: 'supply',
  token: fakeAssets[0].vToken.underlyingToken,
  baseApyPercentage: fakeAssets[0].supplyApyPercentage,
  tokenDistributions: fakeAssets[0].supplyTokenDistributions,
  simulatedTokenDistributions: bumpTokenDistributions({
    tokenDistributions: fakeAssets[0].supplyTokenDistributions,
  }),
};

const borrowItem: ApyBreakdownItem = {
  type: 'borrow',
  token: fakeAssets[2].vToken.underlyingToken,
  baseApyPercentage: fakeAssets[2].borrowApyPercentage,
  tokenDistributions: fakeAssets[2].borrowTokenDistributions,
  simulatedTokenDistributions: bumpTokenDistributions({
    tokenDistributions: fakeAssets[2].borrowTokenDistributions,
  }),
};

describe('ApyBreakdown', () => {
  it('renders a zero borrow total when no items are provided', () => {
    const { container } = renderComponent(<ApyBreakdown />);

    expect(container.textContent).toBe('Total borrow APY0%');
  });

  it('renders a supply APY breakdown', () => {
    const { container } = renderComponent(<ApyBreakdown items={[supplyItem]} />);

    expect(container.textContent).toBe('Supply APY0.05%Distribution APY0.11%Total supply APY1.16%');
  });

  it('renders a borrow APY breakdown', () => {
    const { container } = renderComponent(<ApyBreakdown items={[borrowItem]} />);

    expect(container.textContent).toBe(
      'Borrow APY-4.97%Distribution APY0.52%Total borrow APY-6.49%',
    );
  });

  it('offsets borrow APY against supply APY when calculating net APY', () => {
    const { container } = renderComponent(<ApyBreakdown items={[supplyItem, borrowItem]} />);

    expect(container.textContent).toBe(
      'Supply APY0.05%Distribution APY0.11%Borrow APY-4.97%Distribution APY0.52%Net APY7.66%',
    );
  });

  it('renders simulated base and Prime APYs', () => {
    const asset = fakeAssets[1];
    const item: ApyBreakdownItem = {
      type: 'supply',
      token: asset.vToken.underlyingToken,
      baseApyPercentage: asset.supplyApyPercentage,
      tokenDistributions: asset.supplyTokenDistributions,
      simulatedBaseApyPercentage: asset.supplyApyPercentage.plus(1),
      simulatedTokenDistributions: bumpTokenDistributions({
        tokenDistributions: asset.supplyTokenDistributions,
      }),
    };
    const { container } = renderComponent(<ApyBreakdown items={[item]} />);

    expect(container.textContent).toBe(
      'Supply APY4.88%Distribution APY1.35%Prime APY0.75%1.75%Total supply APY8.99%',
    );
  });

  it('excludes inactive, zero, and Prime simulation distributions', () => {
    const distribution = fakeAssets[0].supplyTokenDistributions[0];
    const item: ApyBreakdownItem = {
      type: 'supply',
      token: fakeAssets[0].vToken.underlyingToken,
      baseApyPercentage: new BigNumber(2),
      tokenDistributions: [
        {
          ...distribution,
          apyPercentage: new BigNumber(5),
          isActive: false,
        },
        {
          ...distribution,
          apyPercentage: new BigNumber(0),
        },
        {
          type: 'primeSimulation',
          token: fakeAssets[0].vToken.underlyingToken,
          apyPercentage: new BigNumber(3),
          isActive: true,
          referenceValues: {
            userSupplyBalanceTokens: new BigNumber(0),
            userBorrowBalanceTokens: new BigNumber(0),
            userXvsStakedTokens: new BigNumber(0),
          },
        },
      ],
    };
    const { container } = renderComponent(<ApyBreakdown items={[item]} />);

    expect(container.textContent).toBe('Supply APY2%Total supply APY2%');
  });

  it('renders the total as an accordion title', () => {
    const { getByRole } = renderComponent(
      <ApyBreakdown items={[supplyItem]} renderType="accordion" />,
    );

    expect(getByRole('button')).toHaveTextContent('Total supply APY1.16%');
  });
});
