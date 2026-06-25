import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { RulesModal } from '..';

describe('pages/PrimeLeaderboard/RulesModal', () => {
  it('renders the rules content', async () => {
    renderComponent(<RulesModal isOpen handleClose={() => {}} />);

    expect(await screen.findByText('Rules')).toBeInTheDocument();
    expect(screen.getByText('Days held')).toBeInTheDocument();
    expect(screen.getByText('2.0× (max)')).toBeInTheDocument();
  });
});
