import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { PrimeSimulationDistribution, TokenDistribution } from 'types';
import { DistributionList } from '..';

const token = assetData[0].vToken.underlyingToken;

const gatedMerklDistribution: TokenDistribution = {
  type: 'merkl',
  token,
  apyPercentage: new BigNumber(0),
  dailyDistributedTokens: new BigNumber(0),
  isActive: true,
  collateralGate: {
    isUserEligible: false,
    maxApyPercentage: new BigNumber(7),
  },
  rewardDetails: {
    appName: 'Merkl',
    claimUrl: 'https://app.merkl.xyz/',
    marketAddress: assetData[0].vToken.address,
    merklCampaignIdentifier: '0xfake',
    description: 'Merkl campaign',
    tags: [],
    aprPercentage: 7,
    participatingCollateralAddresses: ['0x0000000000000000000000000000000000000001'],
    eligibleBorrowMarketAddresses: [assetData[0].vToken.address],
  },
};

const primeSimulationDistribution: PrimeSimulationDistribution = {
  type: 'primeSimulation',
  token,
  apyPercentage: new BigNumber(1),
  isActive: true,
  referenceValues: {
    userSupplyBalanceTokens: new BigNumber(0),
    userBorrowBalanceTokens: new BigNumber(0),
    userXvsStakedTokens: new BigNumber(0),
  },
};

describe('DistributionList', () => {
  it('lists the estimated campaign and Prime rates when advertising them', () => {
    const { getByText } = renderComponent(
      <DistributionList
        type="borrow"
        token={token}
        baseApyPercentage={new BigNumber(-2)}
        tokenDistributions={[gatedMerklDistribution, primeSimulationDistribution]}
        primeSimulationDistribution={primeSimulationDistribution}
        pointDistributions={[]}
        showEstimatedRewards
      />,
    );

    expect(getByText(en.apy.boost.tooltip.borrowApy.name)).toBeInTheDocument();
    expect(getByText('-2%')).toBeInTheDocument();

    expect(getByText(gatedMerklDistribution.rewardDetails.description)).toBeInTheDocument();
    expect(getByText('-7%')).toBeInTheDocument();

    expect(getByText(en.apy.boost.tooltip.primeDistribution.name)).toBeInTheDocument();
    expect(getByText('-1%')).toBeInTheDocument();
  });

  it('leaves out the rates the user is not earning yet otherwise', () => {
    const { getByText, queryByText } = renderComponent(
      <DistributionList
        type="borrow"
        token={token}
        baseApyPercentage={new BigNumber(-2)}
        tokenDistributions={[gatedMerklDistribution, primeSimulationDistribution]}
        primeSimulationDistribution={primeSimulationDistribution}
        pointDistributions={[]}
      />,
    );

    expect(getByText(en.apy.boost.tooltip.borrowApy.name)).toBeInTheDocument();
    expect(queryByText(gatedMerklDistribution.rewardDetails.description)).not.toBeInTheDocument();
    expect(queryByText(en.apy.boost.tooltip.primeDistribution.name)).not.toBeInTheDocument();
  });

  it('lists the Prime rate the user is already earning', () => {
    const { getByText } = renderComponent(
      <DistributionList
        type="borrow"
        token={token}
        baseApyPercentage={new BigNumber(-2)}
        tokenDistributions={[gatedMerklDistribution]}
        primeApyPercentage={new BigNumber(3)}
        userBalanceTokens={new BigNumber(1)}
        pointDistributions={[]}
        showEstimatedRewards
      />,
    );

    expect(getByText(en.apy.boost.tooltip.primeDistribution.description)).toBeInTheDocument();
    expect(getByText('-3%')).toBeInTheDocument();
  });
});
