import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { UserRewardsSection } from '..';

describe('pages/PrimeLeaderboard/UserRewardsSection', () => {
  it('renders the user Prime rewards from the data hook', () => {
    renderComponent(<UserRewardsSection />);

    expect(screen.getByText('Your Prime rewards this cycle')).toBeInTheDocument();
    expect(screen.getByText('$18.4K')).toBeInTheDocument();
  });
});
