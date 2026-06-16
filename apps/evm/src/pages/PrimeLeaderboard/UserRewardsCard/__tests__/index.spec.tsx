import { screen } from '@testing-library/react';

import { usdc, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';
import { UserRewardsCard } from '..';

describe('pages/PrimeLeaderboard/UserRewardsCard', () => {
  it('renders the user total, per-market rewards and Prime APYs', () => {
    renderComponent(
      <UserRewardsCard
        totalRewardsCents={1_840_000}
        marketRewards={[
          { token: usdc, rewardsCents: 1_140_000, apyPercentage: 3.78 },
          { token: xvs, rewardsCents: 700_000, apyPercentage: 4.2 },
        ]}
      />,
    );

    expect(screen.getByText('Your Prime rewards this cycle')).toBeInTheDocument();
    expect(screen.getByText('$18.4K')).toBeInTheDocument();
    expect(screen.getByText(usdc.symbol)).toBeInTheDocument();
    expect(screen.getByText('3.78%')).toBeInTheDocument();
  });
});
