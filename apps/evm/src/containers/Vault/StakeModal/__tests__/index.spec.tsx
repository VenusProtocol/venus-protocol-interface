import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { vai, xvs } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { getBalanceOf, useStakeInVault } from 'clients/api';
import { en } from 'libs/translations';

import StakeModal, { type StakeModalProps } from '..';
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
    (getBalanceOf as Mock).mockImplementation(() => ({ balanceMantissa: fakeBalanceMantissa }));
  });

  it('renders without crashing', async () => {
    renderComponent(<StakeModal {...baseProps} />);
  });

  it('fetches and displays the user balance correctly', async () => {
    const { getByTestId } = renderComponent(<StakeModal {...baseProps} />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() =>
      expect(getByTestId(TEST_IDS.availableTokens).textContent).toMatchInlineSnapshot(
        `"Available VAI100K VAI"`,
      ),
    );
  });

  it('calls stake function then calls handleClose callback on success', async () => {
    const mockStake = vi.fn();
    (useStakeInVault as Mock).mockReturnValue({
      stake: mockStake,
    });

    const customProps: StakeModalProps = {
      ...baseProps,
      handleClose: vi.fn(),
    };

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

    await waitFor(() => expect(mockStake).toHaveBeenCalledTimes(1));
    expect(mockStake.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "amountMantissa": "100000000000000000000",
          "poolIndex": 6,
          "rewardToken": {
            "address": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-xvs-asset",
            "symbol": "XVS",
          },
          "stakedToken": {
            "address": "0x5fFbE5302BadED40941A403228E6AD03f93752d9",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-vai-asset",
            "symbol": "VAI",
          },
        },
      ]
    `);

    await waitFor(() => expect(customProps.handleClose).toHaveBeenCalledTimes(1));
  });
});
