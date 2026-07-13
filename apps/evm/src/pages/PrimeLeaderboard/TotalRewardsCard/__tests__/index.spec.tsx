import { screen } from '@testing-library/react';

import { usdc, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';
import { TotalRewardsCard } from '..';

describe('pages/PrimeLeaderboard/TotalRewardsCard', () => {
  it('renders the total and per-market rewards', () => {
    renderComponent(
      <TotalRewardsCard
        totalRewardsCents={46_230_000}
        totalEstimatedRewardsCents={60_000_000}
        marketRewards={[
          { token: usdc, rewardsCents: 28_040_000 },
          { token: xvs, rewardsCents: 17_190_000 },
        ]}
      />,
    );

    expect(screen.getByText('Total Prime rewards distributed')).toBeInTheDocument();
    expect(screen.getByText('$462.3K')).toBeInTheDocument();
    expect(screen.getByText('$600K')).toBeInTheDocument();
    expect(screen.getByText('$280.4K')).toBeInTheDocument();
    expect(screen.getByText('$171.9K')).toBeInTheDocument();
    expect(screen.getByText(usdc.symbol)).toBeInTheDocument();
    expect(screen.getByText(xvs.symbol)).toBeInTheDocument();
  });
});
