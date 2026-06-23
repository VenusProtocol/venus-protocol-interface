import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { LastCycleSummaryModal } from '..';

describe('pages/PrimeLeaderboard/LastCycleSummaryModal', () => {
  it('renders the last cycle user rank and rewards', async () => {
    renderComponent(<LastCycleSummaryModal isOpen handleClose={() => {}} />);

    expect(await screen.findByText('Last Cycle Prime Summary')).toBeInTheDocument();
    expect(screen.getByText('You ranked')).toBeInTheDocument();
    expect(screen.getByText('Your Prime rewards last cycle')).toBeInTheDocument();
  });
});
