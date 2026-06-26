import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';

import { EligibilityStatus } from '..';

const baseProps = {
  hasStakedXvs: true,
  isCandidate: true,
  gapXvsTokens: 5_432,
};

describe('pages/PrimeLeaderboard/RankCard/EligibilityStatus', () => {
  it('shows the eligible message for candidates', () => {
    renderComponent(<EligibilityStatus {...baseProps} />);

    expect(
      screen.getByText('You are currently eligible for Prime during the next cycle.'),
    ).toBeInTheDocument();
  });

  it('shows the exact XVS to stake when the gap to the top 500 is small', () => {
    renderComponent(<EligibilityStatus {...baseProps} isCandidate={false} gapXvsTokens={5_432} />);

    expect(screen.getByText('5,432.00 XVS')).toBeInTheDocument();
  });

  it('shows a generic message when the gap to the top 500 is large', () => {
    renderComponent(
      <EligibilityStatus {...baseProps} isCandidate={false} gapXvsTokens={200_000} />,
    );

    expect(
      screen.getByText('Stake more XVS to compete for Prime during the next cycle.'),
    ).toBeInTheDocument();
  });

  it('shows the compete message when the gap is unavailable', () => {
    renderComponent(<EligibilityStatus {...baseProps} isCandidate={false} gapXvsTokens={0} />);

    expect(screen.getByText('Stake more XVS to compete for Prime.')).toBeInTheDocument();
  });

  it('prompts to stake when no XVS is staked', () => {
    renderComponent(<EligibilityStatus {...baseProps} hasStakedXvs={false} isCandidate={false} />);

    expect(screen.getByText('Stake XVS to compete for Prime.')).toBeInTheDocument();
  });
});
