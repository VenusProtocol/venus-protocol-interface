import { screen } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { getBalanceOf } from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { renderComponent } from 'testUtils/render';

import { StakeXvsModal } from '..';

describe('pages/PrimeLeaderboard/StakeXvsModal', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'primeLeaderboard',
    );
    (getBalanceOf as Mock).mockResolvedValue({
      balanceMantissa: new BigNumber(0),
    });
  });

  it('opens the governance vault modal with the Prime rank footer and no leaderboard link', async () => {
    renderComponent(<StakeXvsModal handleClose={() => {}} />, {
      accountAddress: fakeAddress,
    });

    expect(await screen.findByText('#2')).toBeInTheDocument();
    expect(screen.getByText('542.5M')).toBeInTheDocument();
    expect(screen.queryByText('Prime Leaderboard')).not.toBeInTheDocument();
  });
});
