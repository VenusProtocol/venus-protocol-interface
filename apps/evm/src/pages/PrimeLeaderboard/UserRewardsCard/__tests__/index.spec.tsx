import { screen } from '@testing-library/react';

import { usdc, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';
import { UserRewardsCard } from '..';

describe('pages/PrimeLeaderboard/UserRewardsCard', () => {
  it('renders the user total and per-market rewards', () => {
    renderComponent(
      <UserRewardsCard
        totalRewardsCents={1_840_000}
        marketRewards={[
          { token: usdc, rewardsCents: 1_140_000 },
          { token: xvs, rewardsCents: 700_000 },
        ]}
      />,
    );

    expect(screen.getByText('Your Prime rewards this cycle')).toBeInTheDocument();
    expect(screen.getByText('$18.4K')).toBeInTheDocument();
    expect(screen.getByText(usdc.symbol)).toBeInTheDocument();
  });

  it('renders the provided content instead of the default headline', () => {
    renderComponent(
      <UserRewardsCard
        totalRewardsCents={0}
        marketRewards={[]}
        content={<span>Eligibility message</span>}
      />,
    );

    expect(screen.getByText('Eligibility message')).toBeInTheDocument();
    expect(screen.queryByText('$0')).not.toBeInTheDocument();
  });
});
