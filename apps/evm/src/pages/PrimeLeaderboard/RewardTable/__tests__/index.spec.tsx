import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { RewardTable } from '..';

describe('pages/PrimeLeaderboard/RewardTable', () => {
  it('renders the reward columns and per-wallet rewards', () => {
    renderComponent(<RewardTable />);

    expect(screen.getAllByText('Total rewards').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$500').length).toBeGreaterThan(0);
    expect(screen.getAllByText('$40K').length).toBeGreaterThan(0);
  });
});
