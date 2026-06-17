import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { UserRewardsSection } from '..';

describe('pages/PrimeLeaderboard/UserRewardsSection', () => {
  it('renders the user Prime rewards from the data hook', async () => {
    renderComponent(<UserRewardsSection />);

    expect(await screen.findByText('Your Prime rewards this cycle')).toBeInTheDocument();
    expect(await screen.findByText('$18.4K')).toBeInTheDocument();
  });
});
