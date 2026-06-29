import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { useIsUserPrime } from 'hooks/useIsUserPrime';
import { renderComponent } from 'testUtils/render';

import { UserRewardsSection } from '..';

vi.mock('hooks/useIsUserPrime');

describe('pages/PrimeLeaderboard/UserRewardsSection', () => {
  beforeEach(() => {
    (useIsUserPrime as Mock).mockReturnValue({ isUserPrime: true, isLoading: false });
  });

  it('renders the user Prime rewards from the data hook', async () => {
    renderComponent(<UserRewardsSection />);

    expect(await screen.findByText('Your Prime rewards this cycle')).toBeInTheDocument();
    expect(await screen.findByText('$18.4K')).toBeInTheDocument();
  });

  it('replaces the headline with the not eligible message when the user is not Prime', async () => {
    (useIsUserPrime as Mock).mockReturnValue({ isUserPrime: false, isLoading: false });

    renderComponent(<UserRewardsSection />);

    expect(
      await screen.findByText(
        'You are currently NOT eligible for sharing the Prime rewards during this cycle. Stake XVS to compete for Prime in the next cycle.',
      ),
    ).toBeInTheDocument();
    // the total headline is replaced by the message, while the per-market details remain
    expect(screen.queryByText('$18.4K')).not.toBeInTheDocument();
  });
});
