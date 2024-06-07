import { waitFor } from '@testing-library/react';
import noop from 'noop-ts';

import fakeAddress from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { en } from 'libs/translations';

import WithdrawFromVestingVaultModal from '.';

const fakePoolIndex = 6;
const fakeStokedToken = vai;

describe('pages/Vault/modals/WithdrawFromVestingVaultModal', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <WithdrawFromVestingVaultModal
        poolIndex={fakePoolIndex}
        stakedToken={fakeStokedToken}
        handleClose={noop}
        userHasPendingWithdrawalsFromBeforeUpgrade={false}
      />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByText(en.withdrawFromVestingVaultModalModal.withdrawTabTitle));
  });
});
