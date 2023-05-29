import { waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';
import { BscChainId } from 'types';

import fakeAccountAddress from '__mocks__/models/address';
import TEST_IDS from 'components/Spinner/testIds';
import mainContractAddresses from 'constants/contracts/addresses/main.json';
import { TOKENS } from 'constants/tokens';
import useTokenApproval from 'hooks/useTokenApproval';
import renderComponent from 'testUtils/renderComponent';

import ActionModal, { ActionModalProps } from '.';

jest.mock('clients/api');

const baseProps: ActionModalProps = {
  title: 'Fake title',
  isInitialLoading: false,
  connectWalletMessage: 'Fake connect wallet message',
  token: TOKENS.xvs,
  submitButtonLabel: 'Fake submit button label',
  submitButtonDisabledLabel: 'fake submit button disabled label',
  handleClose: noop,
  onSubmit: noop,
  isSubmitting: false,
  availableTokensWei: new BigNumber('100000000000000000000000'),
  availableTokensLabel: 'Available XVS',
  tokenNeedsToBeApproved: true,
  approveTokenMessage: 'Fake approve token message',
  spenderAddress: mainContractAddresses.xvsVaultProxy[BscChainId.TESTNET],
  successfulTransactionTitle: 'Fake successful transaction modal title',
  successfulTransactionDescription: 'Fake successful transaction modal description',
};

describe('pages/Vault/modals/ActionModal', () => {
  it('renders without crashing', async () => {
    renderComponent(<ActionModal {...baseProps} />);
  });

  it('displays spinner if isInitialLoading is true', async () => {
    const customProps: ActionModalProps = {
      ...baseProps,
      isInitialLoading: true,
    };
    const { getByTestId } = renderComponent(<ActionModal {...customProps} />);

    await waitFor(() => getByTestId(TEST_IDS.spinner));
  });

  it('prompts user to connect their wallet if they have not done so already', async () => {
    const { getByText } = renderComponent(<ActionModal {...baseProps} />);

    await waitFor(() => getByText(baseProps.connectWalletMessage));
  });

  it('prompts user who connected their wallet to approve token if they have not done so already', async () => {
    // Mark all tokens as having not been approved
    (useTokenApproval as jest.Mock).mockImplementation(() => ({
      isTokenApproved: false,
      isTokenApprovalStatusLoading: false,
      isApproveTokenLoading: false,
      approveToken: noop,
    }));

    const { getByText } = renderComponent(<ActionModal {...baseProps} />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    await waitFor(() => getByText(baseProps.approveTokenMessage as string));
  });

  it('displays transaction form if user have connected their wallet and approved token', async () => {
    const { getByText } = renderComponent(<ActionModal {...baseProps} />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
      },
    });

    await waitFor(() => getByText(baseProps.submitButtonDisabledLabel));
  });
});
