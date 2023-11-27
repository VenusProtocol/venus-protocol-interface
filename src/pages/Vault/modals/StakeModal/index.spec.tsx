import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { en } from 'packages/translations';
import React from 'react';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { vai, xvs } from '__mocks__/models/tokens';
import { getBalanceOf, useStakeInVault } from 'clients/api';
import { renderComponent } from 'testUtils/render';

import StakeModal, { StakeModalProps } from '.';
import TEST_IDS from '../../TransactionForm/testIds';

const fakeBalanceMantissa = new BigNumber('100000000000000000000000');

const baseProps: StakeModalProps = {
  stakedToken: vai,
  rewardToken: xvs,
  poolIndex: 6,
  handleClose: noop,
};

describe('pages/Vault/modals/StakeModal', () => {
  beforeEach(() => {
    (getBalanceOf as Vi.Mock).mockImplementation(() => ({ balanceMantissa: fakeBalanceMantissa }));
  });

  it('renders without crashing', async () => {
    renderComponent(<StakeModal {...baseProps} />);
  });

  it('fetches and displays the user balance correctly', async () => {
    const { getByTestId } = renderComponent(<StakeModal {...baseProps} />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(getByTestId(TEST_IDS.availableTokens).textContent).toMatchSnapshot(),
    );
  });

  it('calls stake function then calls handleClose callback on success', async () => {
    const customProps: StakeModalProps = {
      ...baseProps,
      handleClose: vi.fn(),
    };

    const { stake } = useStakeInVault({
      stakedToken: customProps.stakedToken,
      rewardToken: customProps.rewardToken,
      poolIndex: customProps.poolIndex,
    });

    const { getByTestId, getByText } = renderComponent(<StakeModal {...customProps} />, {
      accountAddress: fakeAccountAddress,
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

    const fakeStakedMantissa = new BigNumber(fakeValueTokens).multipliedBy(
      new BigNumber(10).pow(18),
    );

    await waitFor(() => expect(stake).toHaveBeenCalledTimes(1));
    expect(stake).toHaveBeenCalledWith({
      amountMantissa: fakeStakedMantissa,
    });

    await waitFor(() => expect(customProps.handleClose).toHaveBeenCalledTimes(1));
  });
});
