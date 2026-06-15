import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { LastCycleSummaryModal } from '..';

describe('pages/PrimeLeaderboard/LastCycleSummaryModal', () => {
  it('renders the last cycle total and user Prime rewards', async () => {
    renderComponent(<LastCycleSummaryModal isOpen handleClose={() => {}} />);

    expect(await screen.findByText('Last Cycle Prime Summary')).toBeInTheDocument();
    expect(
      screen.getByText('Total Prime rewards distributed during the last cycle'),
    ).toBeInTheDocument();
    expect(screen.getByText('Your Prime rewards last cycle')).toBeInTheDocument();
  });
});
