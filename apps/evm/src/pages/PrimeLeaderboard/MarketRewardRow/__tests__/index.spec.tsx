import { screen } from '@testing-library/react';

import { usdc } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';
import { MarketRewardRow } from '..';

describe('pages/PrimeLeaderboard/MarketRewardRow', () => {
  it('renders the token, reward amount and trailing content', () => {
    renderComponent(
      <MarketRewardRow
        token={usdc}
        rewardsCents={28_040_000}
        totalRewardsCents={46_230_000}
        apy={<span>3.78%</span>}
      />,
    );

    expect(screen.getByText(usdc.symbol)).toBeInTheDocument();
    expect(screen.getByText('$280.4K')).toBeInTheDocument();
    expect(screen.getByText('3.78%')).toBeInTheDocument();
  });
});
