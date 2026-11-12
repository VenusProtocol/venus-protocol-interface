import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { Footer } from '..';
import { useGetPrimeRank } from '../../useGetPrimeRank';

vi.mock('../../useGetPrimeRank');

const rankData = {
  hasStakedXvs: false,
  isCandidate: false,
  rank: 0,
  primeScore: 0,
  gapXvsTokens: 0,
  isLoading: false,
};

describe('Footer', () => {
  it('shows #— / — and a connect prompt when the wallet is not connected', () => {
    (useGetPrimeRank as Mock).mockReturnValue(rankData);

    renderComponent(<Footer />);

    expect(screen.getByText('#—')).toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText(en.primeLeaderboard.rankFooter.connectPrompt)).toBeInTheDocument();
  });

  it('shows #— / 0 when the connected user has not staked XVS', () => {
    (useGetPrimeRank as Mock).mockReturnValue(rankData);

    renderComponent(<Footer />, { accountAddress: fakeAccountAddress });

    expect(screen.getByText('#—')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows the rank and live score when the connected user has staked XVS', () => {
    (useGetPrimeRank as Mock).mockReturnValue({
      ...rankData,
      hasStakedXvs: true,
      isCandidate: true,
      rank: 12,
      primeScore: 1500,
    });

    renderComponent(<Footer />, { accountAddress: fakeAccountAddress });

    expect(screen.getByText('#12')).toBeInTheDocument();
    expect(screen.getByText('1.5K')).toBeInTheDocument();
  });
});
