import { screen } from '@testing-library/react';
import noop from 'noop-ts';

import type { PrimeRankData } from 'containers/PrimeRank/useGetPrimeRank';
import { renderComponent } from 'testUtils/render';

import { RankCard } from '..';

const rankData: PrimeRankData = {
  hasStakedXvs: true,
  isCandidate: true,
  isPrime: true,
  hasSupplied: true,
  rank: 2,
  primeScore: 542_500_000,
  gapXvsTokens: 5_432,
};

describe('pages/PrimeLeaderboard/RankCard', () => {
  it('renders the rank, Prime score and actions when connected', () => {
    renderComponent(<RankCard isUserConnected onConnect={noop} rankData={rankData} />);

    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('542.5M')).toBeInTheDocument();
    expect(screen.getByText('Stake XVS')).toBeInTheDocument();
    expect(screen.getByText('Rules')).toBeInTheDocument();
  });

  it('prompts to connect the wallet when not connected', () => {
    renderComponent(<RankCard isUserConnected={false} onConnect={noop} rankData={rankData} />);

    expect(screen.getByText('Connect wallet to check your Prime eligibility.')).toBeInTheDocument();
    expect(screen.queryByText('#2')).not.toBeInTheDocument();
  });
});
