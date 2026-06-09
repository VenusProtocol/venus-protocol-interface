import { screen } from '@testing-library/react';

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

vi.mock('../TotalRewardsCard', () => ({
  TotalRewardsCard: () => <div data-testid="total-rewards-card" />,
}));

vi.mock('../UserRewardsCard', () => ({
  UserRewardsCard: () => <div data-testid="user-rewards-card" />,
}));

vi.mock('../RewardTable', () => ({
  RewardTable: () => <div data-testid="reward-table" />,
}));

vi.mock('../RankCard', () => ({
  RankCard: () => <div data-testid="rank-card" />,
}));

vi.mock('../RankTable', () => ({
  RankTable: () => <div data-testid="rank-table" />,
}));

describe('pages/PrimeLeaderboard', () => {
  it('renders every section', () => {
    renderComponent(<PrimeLeaderboard />);

    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('end-of-cycle')).toBeInTheDocument();
    expect(screen.getByTestId('total-rewards-card')).toBeInTheDocument();
    expect(screen.getByTestId('user-rewards-card')).toBeInTheDocument();
    expect(screen.getByTestId('reward-table')).toBeInTheDocument();
    expect(screen.getByTestId('rank-card')).toBeInTheDocument();
    expect(screen.getByTestId('rank-table')).toBeInTheDocument();
  });
});
