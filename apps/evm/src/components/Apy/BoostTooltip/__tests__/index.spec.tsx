import { fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { routes } from 'constants/routing';
import { en } from 'libs/translations';
import { Route } from 'react-router';
import { renderComponent } from 'testUtils/render';
import type { TokenDistribution } from 'types';
import { BoostTooltip } from '..';

vi.mock('components/Tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <div>
      <div>{content}</div>
      {children}
    </div>
  ),
}));

const fakeToken = poolData[0].assets[0].vToken.underlyingToken;

const genericDistribution = {
  token: fakeToken,
  apyPercentage: new BigNumber(3.5),
  dailyDistributedTokens: new BigNumber(0),
  isActive: true,
  rewardDetails: {
    name: 'Liquidity Hub',
    description: 'Liquidity Hub intrinsic APY',
  },
};

const renderBoostTooltip = (tokenDistributions: TokenDistribution[]) =>
  renderComponent(
    <BoostTooltip
      type="supply"
      token={fakeToken}
      baseApyPercentage={new BigNumber(2)}
      tokenDistributions={tokenDistributions}
      pointDistributions={[]}
    />,
  );

describe('BoostTooltip', () => {
  it('renders the Liquidity Hub intrinsic APY distribution', () => {
    const { container } = renderBoostTooltip([
      { ...genericDistribution, type: 'liquidity-hub-intrinsic' },
    ]);

    expect(container.textContent).toContain(en.apy.boost.tooltip.liquidityHubIntrinsicApy.name);
    expect(container.textContent).toContain('3.5%');
  });

  it('renders the Liquidity Hub name as a link to the Liquidity Hubs page', () => {
    const { getByRole } = renderBoostTooltip([
      { ...genericDistribution, type: 'liquidity-hub-intrinsic' },
    ]);

    const link = getByRole('link', { name: 'Venus Liquidity Hub' });

    expect(link.getAttribute('href')).toContain(routes.liquidityHubs.path);
  });

  it('does not bubble the link click up to the surrounding row', () => {
    const onRowClick = vi.fn();
    const { getByRole } = renderComponent(
      <button type="button" onClick={onRowClick}>
        <BoostTooltip
          type="supply"
          token={fakeToken}
          baseApyPercentage={new BigNumber(2)}
          tokenDistributions={[{ ...genericDistribution, type: 'liquidity-hub-intrinsic' }]}
          pointDistributions={[]}
        />
      </button>,
      { otherRoutes: <Route path={routes.liquidityHubs.path} element={<div />} /> },
    );

    fireEvent.click(getByRole('link', { name: 'Venus Liquidity Hub' }));

    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('does not leak the link markup into the description', () => {
    const { container } = renderBoostTooltip([
      { ...genericDistribution, type: 'liquidity-hub-intrinsic' },
    ]);

    expect(container.textContent).not.toContain('AppLink');
    expect(container.textContent).toContain(
      en.apy.boost.tooltip.liquidityHubIntrinsicApy.description.replace(/<\/?AppLink>/g, ''),
    );
  });

  it('renders other intrinsic distributions without a link', () => {
    const { container, queryByRole } = renderBoostTooltip([
      { ...genericDistribution, type: 'intrinsic' },
    ]);

    expect(container.textContent).toContain(en.apy.boost.tooltip.intrinsicApy.name);
    expect(queryByRole('link')).toBeNull();
  });
});
