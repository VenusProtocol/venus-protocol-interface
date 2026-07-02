import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { RankTable } from '..';

describe('pages/PrimeLeaderboard/RankTable', () => {
  it('renders the ranking columns, ranks and Prime scores', async () => {
    renderComponent(<RankTable />);

    expect(screen.getAllByText('Prime score').length).toBeGreaterThan(0);
    expect((await screen.findAllByText('#1')).length).toBeGreaterThan(0);
    expect((await screen.findAllByText('613.5M')).length).toBeGreaterThan(0);
  });
});
