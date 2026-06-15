import { screen } from '@testing-library/react';

import fakeAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';
import PrimeLeaderboard from '..';

vi.mock('components', () => ({
  Page: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
  Card: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../Hero', () => ({
  Hero: () => <div data-testid="hero" />,
}));

vi.mock('../EndOfCycle', () => ({
  EndOfCycle: () => <div data-testid="end-of-cycle" />,
}));

vi.mock('../TotalRewardsSection', () => ({
  TotalRewardsSection: () => <div data-testid="total-rewards-section" />,
}));

vi.mock('../UserRewardsSection', () => ({
  UserRewardsSection: () => <div data-testid="user-rewards-section" />,
}));

vi.mock('../RewardTable', () => ({
  RewardTable: () => <div data-testid="reward-table" />,
}));

vi.mock('../RankSection', () => ({
  RankSection: () => <div data-testid="rank-section" />,
}));

vi.mock('../RankTable', () => ({
  RankTable: () => <div data-testid="rank-table" />,
}));

describe('pages/PrimeLeaderboard', () => {
  it('renders every section when the wallet is connected', () => {
    renderComponent(<PrimeLeaderboard />, { accountAddress: fakeAddress });

    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('end-of-cycle')).toBeInTheDocument();
    expect(screen.getByTestId('total-rewards-section')).toBeInTheDocument();
    expect(screen.getByTestId('user-rewards-section')).toBeInTheDocument();
    expect(screen.getByTestId('reward-table')).toBeInTheDocument();
    expect(screen.getByTestId('rank-section')).toBeInTheDocument();
    expect(screen.getByTestId('rank-table')).toBeInTheDocument();
  });

  it('hides the user rewards card when the wallet is not connected', () => {
    renderComponent(<PrimeLeaderboard />);

    expect(screen.getByTestId('total-rewards-section')).toBeInTheDocument();
    expect(screen.queryByTestId('user-rewards-section')).not.toBeInTheDocument();
  });
});
