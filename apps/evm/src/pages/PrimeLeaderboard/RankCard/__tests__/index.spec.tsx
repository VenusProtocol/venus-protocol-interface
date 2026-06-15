import { screen } from '@testing-library/react';

import fakeAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { RankCard } from '..';

describe('pages/PrimeLeaderboard/RankCard', () => {
  it('renders the rank, Prime score and actions when the wallet is connected', () => {
    renderComponent(<RankCard />, { accountAddress: fakeAddress });

    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('542.5M')).toBeInTheDocument();
    expect(screen.getByText('Stake XVS')).toBeInTheDocument();
    expect(screen.getByText('Rules')).toBeInTheDocument();
  });

  it('prompts to connect the wallet when none is connected', () => {
    renderComponent(<RankCard />);

    expect(screen.getByText('Connect wallet to check your Prime eligibility.')).toBeInTheDocument();
    expect(screen.queryByText('#2')).not.toBeInTheDocument();
  });
});
