import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';

import fakeAccountAddress from '__mocks__/models/address';
import { getAllowance, getBalanceOf } from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import useStakeInVault from 'hooks/useStakeInVault';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import StakeModal, { StakeModalProps } from '.';
import TEST_IDS from '../../TransactionForm/testIds';

jest.mock('clients/api');
jest.mock('hooks/useStakeInVault');

const fakeBalanceWei = new BigNumber('100000000000000000000000');

const baseProps: StakeModalProps = {
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
      expect(getByTestId(TEST_IDS.availableTokens).textContent).toMatchSnapshot(),
    );
  });

  it('calls stake function then calls handleClose callback on success', async () => {
    const customProps: StakeModalProps = {
      ...baseProps,
      handleClose: jest.fn(),
    };

    const { stake } = useStakeInVault({
      stakedTokenId: customProps.stakedTokenId,
      rewardTokenId: customProps.rewardTokenId,
      poolIndex: customProps.poolIndex,
    });

    const { getByTestId, getByText } = renderComponent(<StakeModal {...customProps} />, {
      authContextValue: {
        account: {
          address: fakeAccountAddress,
        },
      },
    });

    await waitFor(() => getByTestId(TEST_IDS.tokenTextField));

    const fakeValueTokens = '100';

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
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
    });

    await waitFor(() => expect(customProps.handleClose).toHaveBeenCalledTimes(1));
  });
});
