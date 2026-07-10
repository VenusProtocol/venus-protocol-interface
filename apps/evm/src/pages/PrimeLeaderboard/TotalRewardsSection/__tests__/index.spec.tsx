import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { TotalRewardsSection } from '..';

describe('pages/PrimeLeaderboard/TotalRewardsSection', () => {
  it('renders the total Prime rewards from the data hook', async () => {
    renderComponent(<TotalRewardsSection />);

    expect(await screen.findByText('Total distributed Prime rewards')).toBeInTheDocument();
    expect(await screen.findByText('$462.3K')).toBeInTheDocument();
    expect(await screen.findByText('$600K')).toBeInTheDocument();
  });
});
