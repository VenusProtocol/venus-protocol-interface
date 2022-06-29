import React from 'react';
import noop from 'noop-ts';
import { waitFor, fireEvent } from '@testing-library/react';
import BigNumber from 'bignumber.js';

import TEST_IDS from 'constants/testIds';
import MAX_UINT256 from 'constants/maxUint256';
import fakeAccountAddress from '__mocks__/models/address';
import { getBalanceOf, getAllowance } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';
import useStakeInVault from 'hooks/useStakeInVault';
import en from 'translation/translations/en.json';
import StakeModal, { IStakeModalProps } from '.';

jest.mock('clients/api');
jest.mock('hooks/useStakeInVault');

const fakeBalanceWei = new BigNumber('100000000000000000000000');

const baseProps: IStakeModalProps = {
  stakedTokenId: 'vai',
  rewardTokenId: 'xvs',
  poolIndex: 6,
  handleClose: noop,
};

describe('pages/Vault/modals/StakeModal', () => {
  beforeEach(() => {
    // Mark token as enabled
    (getAllowance as jest.Mock).mockImplementation(() => MAX_UINT256);
    (getBalanceOf as jest.Mock).mockImplementation(() => fakeBalanceWei);
  });

  it('renders without crashing', async () => {
    renderComponent(<StakeModal {...baseProps} />);
  });

  it('fetches and displays the user balance correctly', async () => {
    const { getByTestId } = renderComponent(<StakeModal {...baseProps} />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    await waitFor(() =>
      expect(
        getByTestId(TEST_IDS.vault.transactionForm.availableTokens).textContent,
      ).toMatchSnapshot(),
    );
  });

  it('calls stake function then calls handleClose callback on success', async () => {
    const customProps: IStakeModalProps = {
      ...baseProps,
      handleClose: jest.fn(),
    };

    const { stake } = useStakeInVault({ stakedTokenId: customProps.stakedTokenId });

    const { getByTestId, getByText } = renderComponent(<StakeModal {...customProps} />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    await waitFor(() => getByTestId(TEST_IDS.vault.transactionForm.tokenTextField));

    const fakeValueTokens = '100';

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.vault.transactionForm.tokenTextField), {
      target: { value: fakeValueTokens },
    });

    await waitFor(() => getByText(en.stakeModal.submitButtonLabel));

    // Submit form
    const submitButton = getByText(en.stakeModal.submitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    const fakeStakedWei = new BigNumber(fakeValueTokens).multipliedBy(new BigNumber(10).pow(18));

    await waitFor(() => expect(stake).toHaveBeenCalledTimes(1));
    expect(stake).toHaveBeenCalledWith({
      accountAddress: fakeAccountAddress,
      amountWei: fakeStakedWei,
      poolIndex: customProps.poolIndex,
      rewardTokenId: customProps.rewardTokenId,
    });

    await waitFor(() => expect(customProps.handleClose).toHaveBeenCalledTimes(1));
  });
});
