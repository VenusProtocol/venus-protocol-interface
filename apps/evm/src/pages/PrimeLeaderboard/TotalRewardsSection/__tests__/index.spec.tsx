import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { TotalRewardsSection } from '..';

describe('pages/PrimeLeaderboard/TotalRewardsSection', () => {
  it('renders the total Prime rewards from the data hook', () => {
    renderComponent(<TotalRewardsSection />);

    expect(screen.getByText('Total Prime rewards distributed this cycle')).toBeInTheDocument();
    expect(screen.getByText('$462.3K')).toBeInTheDocument();
  });
});
