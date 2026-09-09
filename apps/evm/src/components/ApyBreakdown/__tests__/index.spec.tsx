import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { renderComponent } from 'testUtils/render';
import type { MerklDistribution, TokenDistribution } from 'types';
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

const buildGatedMerklDistribution = (isUserEligible: boolean): MerklDistribution => ({
  type: 'merkl',
  token: fakeAssets[2].vToken.underlyingToken,
  apyPercentage: isUserEligible ? new BigNumber(3) : new BigNumber(0),
  dailyDistributedTokens: new BigNumber(0),
  isActive: true,
  collateralGate: {
    isUserEligible,
    maxApyPercentage: new BigNumber(7),
  },
  rewardDetails: {
    appName: 'Merkl',
    claimUrl: 'https://app.merkl.xyz/',
    marketAddress: fakeAssets[2].vToken.address,
    merklCampaignIdentifier: '0xfake',
    description: 'Merkl campaign',
    tags: [],
    aprPercentage: 7,
    eligibleBorrowAmountUsd: 46379,
    participatingCollateralAddresses: ['0x0000000000000000000000000000000000000001'],
    eligibleBorrowMarketAddresses: [fakeAssets[2].vToken.address],
  },
});

const buildGatedBorrowItem = (isUserEligible: boolean): ApyBreakdownItem => ({
  type: 'borrow',
  token: fakeAssets[2].vToken.underlyingToken,
  baseApyPercentage: new BigNumber(-4),
  tokenDistributions: [buildGatedMerklDistribution(isUserEligible)],
});

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
      'Borrow APY-4.97%Distribution APY-0.52%Total borrow APY-6.49%',
    );
  });

  it('offsets borrow APY against supply APY when calculating net APY', () => {
    const { container } = renderComponent(<ApyBreakdown items={[supplyItem, borrowItem]} />);

    expect(container.textContent).toBe(
      'Supply APY0.05%Distribution APY0.11%Borrow APY-4.97%Distribution APY-0.52%Net APY7.66%',
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

  it('lists a campaign the user qualifies for and folds it into the total', () => {
    const { container } = renderComponent(<ApyBreakdown items={[buildGatedBorrowItem(true)]} />);

    expect(container.textContent).toBe('Borrow APY-4%Merkl campaign APY-3%Total borrow APY-7%');
  });

  it('leaves out a campaign the user has not qualified for', () => {
    const { container } = renderComponent(<ApyBreakdown items={[buildGatedBorrowItem(false)]} />);

    expect(container.textContent).toBe('Borrow APY-4%Total borrow APY-4%');
  });

  it('brings the campaign row back when the simulated amounts make the user qualify', () => {
    const item: ApyBreakdownItem = {
      ...buildGatedBorrowItem(false),
      simulatedTokenDistributions: [
        {
          ...buildGatedMerklDistribution(true),
          apyPercentage: new BigNumber(5),
        },
      ],
    };

    const { container } = renderComponent(<ApyBreakdown items={[item]} />);

    // the row shows 0% -> -5%, the same figure the total already uses
    expect(container.textContent).toBe('Borrow APY-4%Merkl campaign APY0%-5%Total borrow APY-9%');
  });

  it('renders the total as an accordion title', () => {
    const { getByRole } = renderComponent(
      <ApyBreakdown items={[supplyItem]} renderType="accordion" />,
    );

    expect(getByRole('button')).toHaveTextContent('Total supply APY1.16%');
  });
});
