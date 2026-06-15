import { screen } from '@testing-library/react';

import fakeAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { RankSection } from '..';

describe('pages/PrimeLeaderboard/RankSection', () => {
  it('renders the rank card with the data hook when connected', () => {
    renderComponent(<RankSection />, { accountAddress: fakeAddress });

    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('542.5M')).toBeInTheDocument();
  });

  it('prompts to connect the wallet when not connected', () => {
    renderComponent(<RankSection />);

    expect(screen.getByText('Connect wallet to check your Prime eligibility.')).toBeInTheDocument();
  });
});
