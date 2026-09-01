import { fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { routes } from 'constants/routing';
import { en } from 'libs/translations';
import { Route } from 'react-router';
import { renderComponent } from 'testUtils/render';
import type { TokenDistribution } from 'types';
import { ApyBreakdown, type ApyBreakdownItem } from '..';

vi.mock('components/Tooltip', () => ({
  Tooltip: ({ children, content }: { children: React.ReactNode; content: React.ReactNode }) => (
    <div>
      <div>{content}</div>
      {children}
    </div>
  ),
}));

const fakeToken = poolData[0].assets[0].vToken.underlyingToken;

const liquidityHubDistribution: TokenDistribution = {
  type: 'liquidity-hub-intrinsic',
  token: fakeToken,
  apyPercentage: new BigNumber(3.5),
  dailyDistributedTokens: new BigNumber(0),
  isActive: true,
  rewardDetails: {
    name: 'Liquidity Hub',
    description: 'Liquidity Hub intrinsic APY',
  },
};

const item: ApyBreakdownItem = {
  type: 'supply',
  token: fakeToken,
  baseApyPercentage: new BigNumber(2),
  tokenDistributions: [liquidityHubDistribution],
};

describe('ApyBreakdown - Liquidity Hub intrinsic APY', () => {
  it('renders the Liquidity Hub intrinsic APY row', () => {
    const { container } = renderComponent(<ApyBreakdown items={[item]} />);

    expect(container.textContent).toContain(en.apyBreakdown.liquidityHubIntrinsicApy);
    expect(container.textContent).toContain('3.5%');
  });

  it('renders the Liquidity Hub name in the tooltip as a link to the Liquidity Hubs page', () => {
    const { getByRole } = renderComponent(<ApyBreakdown items={[item]} />);

    const link = getByRole('link', { name: 'Venus Liquidity Hub' });

    expect(link.getAttribute('href')).toContain(routes.liquidityHubs.path);
  });

  it('does not bubble the link click up to the surrounding row', () => {
    const onRowClick = vi.fn();
    const { getByRole } = renderComponent(
      <button type="button" onClick={onRowClick}>
        <ApyBreakdown items={[item]} />
      </button>,
      { otherRoutes: <Route path={routes.liquidityHubs.path} element={<div />} /> },
    );

    fireEvent.click(getByRole('link', { name: 'Venus Liquidity Hub' }));

    expect(onRowClick).not.toHaveBeenCalled();
  });

  it('keeps the tooltip copy intact around the link', () => {
    const { container } = renderComponent(<ApyBreakdown items={[item]} />);

    // The <AppLink> markup must not leak into the rendered copy
    expect(container.textContent).not.toContain('AppLink');
    expect(container.textContent).toContain(
      en.apyBreakdown.liquidityHubIntrinsicApyTooltip.replace(/<\/?AppLink>/g, ''),
    );
  });
});
