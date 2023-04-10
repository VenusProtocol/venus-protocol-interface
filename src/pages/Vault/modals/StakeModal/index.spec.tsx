import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';

import fakeAccountAddress from '__mocks__/models/address';
import { getBalanceOf, useStakeInVault } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import StakeModal, { StakeModalProps } from '.';
import TEST_IDS from '../../TransactionForm/testIds';

jest.mock('clients/api');

const fakeBalanceWei = new BigNumber('100000000000000000000000');

const baseProps: StakeModalProps = {
  stakedToken: TOKENS.vai,
  rewardToken: TOKENS.xvs,
  poolIndex: 6,
  handleClose: noop,
};

describe('pages/Vault/modals/StakeModal', () => {
  beforeEach(() => {
    (getBalanceOf as jest.Mock).mockImplementation(() => ({ balanceWei: fakeBalanceWei }));
  });

  it('renders without crashing', async () => {
    renderComponent(<StakeModal {...baseProps} />);
  });

  it('fetches and displays the user balance correctly', async () => {
    const { getByTestId } = renderComponent(<StakeModal {...baseProps} />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
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
      stakedToken: customProps.stakedToken,
      rewardToken: customProps.rewardToken,
      poolIndex: customProps.poolIndex,
    });

    const { getByTestId, getByText } = renderComponent(<StakeModal {...customProps} />, {
      authContextValue: {
        accountAddress: fakeAccountAddress,
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
      amountWei: fakeStakedWei,
    });

    await waitFor(() => expect(customProps.handleClose).toHaveBeenCalledTimes(1));
  });
});
