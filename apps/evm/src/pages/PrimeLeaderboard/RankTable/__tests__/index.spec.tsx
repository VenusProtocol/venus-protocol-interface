import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { RankTable } from '..';

describe('pages/PrimeLeaderboard/RankTable', () => {
  it('renders the ranking columns, ranks and Prime scores', () => {
    renderComponent(<RankTable />);

    expect(screen.getAllByText('Prime score').length).toBeGreaterThan(0);
    expect(screen.getAllByText('#1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('50,000').length).toBeGreaterThan(0);
  });
});
