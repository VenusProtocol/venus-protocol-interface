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
});
