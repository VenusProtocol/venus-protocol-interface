import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { pendleVault } from '__mocks__/models/vaults';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useNow } from 'hooks/useNow';
import { en } from 'libs/translations';
import { renderComponent } from 'testUtils/render';

import { VaultCard } from '..';

vi.mock('hooks/useNow');

const stakedPendleVault = {
  ...pendleVault,
  userStakeBalanceMantissa: new BigNumber('1000000000000000000'),
};

describe('Dashboard VaultCard', () => {
  beforeEach(() => {
    (useNow as Mock).mockReturnValue(new Date('2026-04-01T00:00:00.000Z'));
  });

  it('renders the maturity date of a Pendle vault', () => {
    const { getByText } = renderComponent(<VaultCard vault={stakedPendleVault} />, {
      accountAddress: fakeAccountAddress,
    });

    expect(getByText(en.vault.card.maturityDatePendle)).toBeInTheDocument();
  });

  it('falls back to a placeholder when the Pendle vault has no maturity date', () => {
    const { getByText } = renderComponent(
      <VaultCard vault={{ ...stakedPendleVault, maturityDate: undefined }} />,
      { accountAddress: fakeAccountAddress },
    );

    expect(getByText(en.vault.card.maturityDatePendle)).toBeInTheDocument();
    expect(getByText(PLACEHOLDER_KEY)).toBeInTheDocument();
  });
});
