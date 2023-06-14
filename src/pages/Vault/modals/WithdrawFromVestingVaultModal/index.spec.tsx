import { waitFor } from '@testing-library/react';
import noop from 'noop-ts';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import { TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import WithdrawFromVestingVaultModal from '.';

vi.mock('clients/api');

const fakePoolIndex = 6;
const fakeStokedToken = TOKENS.vai;

describe('pages/Vault/modals/WithdrawFromVestingVaultModal', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <WithdrawFromVestingVaultModal
        poolIndex={fakePoolIndex}
        stakedToken={fakeStokedToken}
        handleClose={noop}
        hasPendingWithdrawalsFromBeforeUpgrade={false}
      />,
      {
        authContextValue: { accountAddress: fakeAddress },
      },
    );

    await waitFor(() => getByText(en.withdrawFromVestingVaultModalModal.withdrawTabTitle));
  });
});
