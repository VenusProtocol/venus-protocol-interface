import { screen } from '@testing-library/react';

import { renderComponent } from 'testUtils/render';
import { Timer } from '..';

describe('pages/PrimeLeaderboard/EndOfCycle/Timer', () => {
  it('renders zero-padded time segments', () => {
    renderComponent(<Timer days={4} hours={12} minutes={3} seconds={9} />);

    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('09')).toBeInTheDocument();
  });
});
