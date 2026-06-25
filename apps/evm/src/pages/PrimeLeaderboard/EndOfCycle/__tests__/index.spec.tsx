import { fireEvent, screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';
import { EndOfCycle } from '..';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

describe('pages/PrimeLeaderboard/EndOfCycle', () => {
  it('renders the active countdown state for a future end date', () => {
    renderComponent(<EndOfCycle endDate={new Date(Date.now() + 5 * ONE_DAY_MS)} />);

    expect(screen.getByText('End of cycle')).toBeInTheDocument();
    expect(screen.getByText("See last cycle's Prime summary")).toBeInTheDocument();
  });

  it('opens the last cycle summary modal from the helper link', async () => {
    renderComponent(<EndOfCycle endDate={new Date(Date.now() + 5 * ONE_DAY_MS)} />);

    fireEvent.click(screen.getByText("See last cycle's Prime summary"));

    expect(await screen.findByText('Last Cycle Prime Summary')).toBeInTheDocument();
  });

  it('renders the ended state for a past end date', () => {
    renderComponent(<EndOfCycle endDate={new Date(Date.now() - ONE_DAY_MS)} />);

    expect(screen.getByText('End of cycle')).toBeInTheDocument();
    expect(screen.queryByText("See last cycle's Prime summary")).not.toBeInTheDocument();
  });
});
