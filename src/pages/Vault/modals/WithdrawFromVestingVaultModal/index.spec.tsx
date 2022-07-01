import React from 'react';
import { waitFor } from '@testing-library/react';
import noop from 'noop-ts';

import { TokenId } from 'types';
import en from 'translation/translations/en.json';
import { TOKENS } from 'constants/tokens';
import fakeAddress from '__mocks__/models/address';
import renderComponent from 'testUtils/renderComponent';
import WithdrawFromVestingVaultModal from '.';

jest.mock('clients/api');

const fakePoolIndex = 6;
const fakeStokedTokenId = TOKENS.vai.id as TokenId;

describe('pages/Vault/modals/WithdrawFromVestingVaultModal', () => {
  it('renders without crashing', async () => {
    const { getByText } = renderComponent(
      <WithdrawFromVestingVaultModal
        poolIndex={fakePoolIndex}
        stakedTokenId={fakeStokedTokenId}
        handleClose={noop}
      />,
      {
        authContextValue: { account: { address: fakeAddress } },
      },
    );

    await waitFor(() => getByText(en.withdrawFromVestingVaultModalModal.withdrawTabTitle));
  });
});
