import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';
import { Hero } from '..';

describe('pages/PrimeLeaderboard/Hero', () => {
  it('renders the page title and description', () => {
    renderComponent(<Hero />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Prime leaderboard');
    expect(
      screen.getByText(
        'Stake XVS into the governance vault and receive Prime rewards on top of your yields.',
      ),
    ).toBeInTheDocument();
  });
});
