import BigNumber from 'bignumber.js';

import { assetData } from '__mocks__/models/asset';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';
import type { TokenDistribution } from 'types';
import { Apy } from '..';

const token = assetData[0].vToken.underlyingToken;

const venusDistribution: TokenDistribution = {
  type: 'venus',
  token,
  apyPercentage: new BigNumber(1),
  dailyDistributedTokens: new BigNumber(1),
  isActive: true,
};

const buildGatedMerklDistribution = (
  isUserEligible: boolean,
  { maxApyPercentage = 7, merklCampaignIdentifier = '0xfake' } = {},
): TokenDistribution => ({
  type: 'merkl',
  token,
  apyPercentage: isUserEligible ? new BigNumber(3) : new BigNumber(0),
  dailyDistributedTokens: new BigNumber(0),
  isActive: true,
  collateralGate: {
    isUserEligible,
    maxApyPercentage: new BigNumber(maxApyPercentage),
  },
  rewardDetails: {
    appName: 'Merkl',
    claimUrl: 'https://app.merkl.xyz/',
    marketAddress: assetData[0].vToken.address,
    merklCampaignIdentifier,
    description: 'Merkl campaign',
    tags: [],
    aprPercentage: maxApyPercentage,
    participatingCollateralAddresses: ['0x0000000000000000000000000000000000000001'],
    eligibleBorrowMarketAddresses: [assetData[0].vToken.address],
  },
});

const buildPrimeDistribution = (apyPercentage: number): TokenDistribution => ({
  type: 'prime',
  token,
  apyPercentage: new BigNumber(apyPercentage),
  isActive: true,
});

const primeSimulationDistribution: TokenDistribution = {
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

describe('Apy', () => {
  it('renders a base APY without a boost', () => {
    const { getByText, queryByAltText } = renderComponent(
      <Apy
        type="supply"
        token={token}
        baseApyPercentage={new BigNumber(2)}
        tokenDistributions={[]}
      />,
    );

    expect(getByText('2%')).toBeInTheDocument();
    expect(queryByAltText(en.apy.boost.iconAlt)).not.toBeInTheDocument();
  });

  it.each([
    {
      type: 'supply',
      baseApyPercentage: new BigNumber(2),
      expectedApy: '3%',
    },
    {
      type: 'borrow',
      baseApyPercentage: new BigNumber(-2),
      expectedApy: '-3%',
    },
  ] as const)('renders a boosted $type APY', ({ type, baseApyPercentage, expectedApy }) => {
    const { getByAltText, getByText } = renderComponent(
      <Apy
        type={type}
        token={token}
        baseApyPercentage={baseApyPercentage}
        tokenDistributions={[venusDistribution]}
      />,
    );

    expect(getByText(expectedApy)).toBeInTheDocument();
    expect(getByAltText(en.apy.boost.iconAlt)).toBeInTheDocument();
  });

  it('ignores inactive and zero token distributions', () => {
    const { getByText, queryByAltText } = renderComponent(
      <Apy
        type="supply"
        token={token}
        baseApyPercentage={new BigNumber(2)}
        tokenDistributions={[
          {
            ...venusDistribution,
            apyPercentage: new BigNumber(10),
            isActive: false,
          },
          {
            ...venusDistribution,
            apyPercentage: new BigNumber(0),
          },
        ]}
      />,
    );

    expect(getByText('2%')).toBeInTheDocument();
    expect(queryByAltText(en.apy.boost.iconAlt)).not.toBeInTheDocument();
  });

  it('shows the boost tooltip trigger for point distributions', () => {
    const { getByAltText, getByText } = renderComponent(
      <Apy
        type="supply"
        token={token}
        baseApyPercentage={new BigNumber(2)}
        tokenDistributions={[]}
        pointDistributions={[
          {
            title: 'Points',
            incentive: '2x',
          },
        ]}
      />,
    );

    expect(getByText('2%')).toBeInTheDocument();
    expect(getByAltText(en.apy.boost.iconAlt)).toBeInTheDocument();
  });

  it('applies muted styling', () => {
    const { container } = renderComponent(
      <Apy
        type="borrow"
        token={token}
        baseApyPercentage={new BigNumber(-2)}
        tokenDistributions={[]}
        isMuted
      />,
    );

    expect(container.firstElementChild).toHaveClass('opacity-50');
    expect(container.querySelector('p')).toHaveClass('text-grey');
  });

  it('renders an active Prime boost', () => {
    const { getByAltText, getByText } = renderComponent(
      <Apy
        type="supply"
        token={token}
        baseApyPercentage={new BigNumber(2)}
        tokenDistributions={[
          {
            type: 'prime',
            token,
            apyPercentage: new BigNumber(1),
            isActive: true,
          },
        ]}
        userBalanceTokens={new BigNumber(1)}
      />,
    );

    expect(getByText('3%')).toBeInTheDocument();
    expect(getByAltText(en.apy.primeBadge.logoAlt)).toBeInTheDocument();
  });

  it('renders a Prime APY simulation', () => {
    const { getByAltText, getByText } = renderComponent(
      <Apy
        type="supply"
        token={token}
        baseApyPercentage={new BigNumber(2)}
        tokenDistributions={[
          {
            type: 'primeSimulation',
            token,
            apyPercentage: new BigNumber(1),
            isActive: true,
            referenceValues: {
              userSupplyBalanceTokens: new BigNumber(0),
              userBorrowBalanceTokens: new BigNumber(0),
              userXvsStakedTokens: new BigNumber(0),
            },
          },
        ]}
      />,
    );

    expect(getByText('2%')).toBeInTheDocument();
    expect(getByText('3%')).toBeInTheDocument();
    expect(getByAltText(en.apy.primeBadge.logoAlt)).toBeInTheDocument();
  });

  it('renders the base borrow APY plus a Merkl badge when the user is missing the required collateral', () => {
    const { getByAltText, getByText, queryByAltText } = renderComponent(
      <Apy
        type="borrow"
        token={token}
        baseApyPercentage={new BigNumber(-2)}
        tokenDistributions={[buildGatedMerklDistribution(false)]}
      />,
    );

    expect(getByText('-2%')).toBeInTheDocument();
    expect(getByText('-9%')).toBeInTheDocument();
    expect(getByAltText(en.apy.merklBadge.logoAlt)).toBeInTheDocument();
    expect(queryByAltText(en.apy.boost.iconAlt)).not.toBeInTheDocument();
  });

  it('folds the Merkl reward into the borrow APY once the user is eligible', () => {
    const { getByAltText, getByText, queryByAltText } = renderComponent(
      <Apy
        type="borrow"
        token={token}
        baseApyPercentage={new BigNumber(-2)}
        tokenDistributions={[buildGatedMerklDistribution(true)]}
      />,
    );

    expect(getByText('-5%')).toBeInTheDocument();
    expect(getByAltText(en.apy.boost.iconAlt)).toBeInTheDocument();
    expect(queryByAltText(en.apy.merklBadge.logoAlt)).not.toBeInTheDocument();
  });

  describe.each([
    {
      name: 'campaign eligible, Prime not eligible',
      tokenDistributions: [buildGatedMerklDistribution(true), primeSimulationDistribution],
      userBalanceTokens: undefined,
      expectedApy: '-5%',
      expectedApyIsBoosted: true,
      expectedBadgeLogoAlt: en.apy.primeBadge.logoAlt,
      expectedBadgeApy: '-6%',
    },
    {
      name: 'campaign and Prime both eligible',
      tokenDistributions: [buildGatedMerklDistribution(true), buildPrimeDistribution(2)],
      userBalanceTokens: new BigNumber(1),
      expectedApy: '-7%',
      expectedApyIsBoosted: true,
      expectedBadgeLogoAlt: undefined,
      expectedBadgeApy: undefined,
    },
    {
      name: 'campaign not eligible, Prime eligible',
      tokenDistributions: [buildGatedMerklDistribution(false), buildPrimeDistribution(2)],
      userBalanceTokens: new BigNumber(1),
      expectedApy: '-4%',
      expectedApyIsBoosted: true,
      expectedBadgeLogoAlt: en.apy.merklBadge.logoAlt,
      expectedBadgeApy: '-11%',
    },
    {
      name: 'campaign and Prime both not eligible',
      tokenDistributions: [buildGatedMerklDistribution(false), primeSimulationDistribution],
      userBalanceTokens: undefined,
      expectedApy: '-2%',
      expectedApyIsBoosted: false,
      expectedBadgeLogoAlt: en.apy.merklBadge.logoAlt,
      expectedBadgeApy: '-10%',
    },
  ])(
    'borrow APY with a collateral-gated campaign and Prime: $name',
    ({
      tokenDistributions,
      userBalanceTokens,
      expectedApy,
      expectedApyIsBoosted,
      expectedBadgeLogoAlt,
      expectedBadgeApy,
    }) => {
      it('renders the expected APY and badge', () => {
        const { getByText, queryByText, getByAltText, queryByAltText } = renderComponent(
          <Apy
            type="borrow"
            token={token}
            baseApyPercentage={new BigNumber(-2)}
            tokenDistributions={tokenDistributions}
            userBalanceTokens={userBalanceTokens}
          />,
        );

        expect(getByText(expectedApy)).toBeInTheDocument();

        if (expectedApyIsBoosted) {
          expect(getByAltText(en.apy.boost.iconAlt)).toBeInTheDocument();
        } else {
          expect(queryByAltText(en.apy.boost.iconAlt)).not.toBeInTheDocument();
        }

        if (expectedBadgeLogoAlt && expectedBadgeApy) {
          expect(getByAltText(expectedBadgeLogoAlt)).toBeInTheDocument();
          expect(getByText(expectedBadgeApy)).toBeInTheDocument();
        } else {
          expect(queryByAltText(en.apy.merklBadge.logoAlt)).not.toBeInTheDocument();
          expect(queryByText('-6%')).not.toBeInTheDocument();
        }
      });
    },
  );

  it('sums every campaign the user has not qualified for into the badge', () => {
    const { getByText } = renderComponent(
      <Apy
        type="borrow"
        token={token}
        baseApyPercentage={new BigNumber(-2)}
        tokenDistributions={[
          buildGatedMerklDistribution(false, {
            maxApyPercentage: 7,
            merklCampaignIdentifier: '0xfirst',
          }),
          buildGatedMerklDistribution(false, {
            maxApyPercentage: 5,
            merklCampaignIdentifier: '0xsecond',
          }),
          primeSimulationDistribution,
        ]}
      />,
    );

    expect(getByText('-2%')).toBeInTheDocument();
    expect(getByText('-15%')).toBeInTheDocument();
  });

  it('keeps the Prime icon next to the APY when the campaign badge is displayed', () => {
    const { getByAltText } = renderComponent(
      <Apy
        type="borrow"
        token={token}
        baseApyPercentage={new BigNumber(-2)}
        tokenDistributions={[buildGatedMerklDistribution(false), buildPrimeDistribution(0)]}
        userBalanceTokens={new BigNumber(1)}
      />,
    );

    expect(getByAltText(en.apy.boost.iconAlt)).toBeInTheDocument();
    expect(getByAltText(en.apy.primeBadge.logoAlt)).toBeInTheDocument();
    expect(getByAltText(en.apy.merklBadge.logoAlt)).toBeInTheDocument();
  });
});
