import { screen } from '@testing-library/react';
import type { Mock } from 'vitest';

import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';

import { StakeXvsModal } from '..';

describe('pages/PrimeLeaderboard/StakeXvsModal', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'primeLeaderboard',
    );
  });

  it('opens the governance vault modal with the Prime rank footer', async () => {
    renderComponent(<StakeXvsModal handleClose={() => {}} />);

    expect(await screen.findByText('#2')).toBeInTheDocument();
    expect(screen.getByText('542.5M')).toBeInTheDocument();
  });
});
