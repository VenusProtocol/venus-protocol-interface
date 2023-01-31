import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import ClaimRewardButton from '..';
import TEST_IDS from '../../testIds';

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('components/Layout/ClaimRewardButton', () => {
  it('renders without crashing', () => {
    renderComponent(<ClaimRewardButton />);
  });

  it.todo(
    'renders nothing if user has not connected any wallet or does not have any pending reward to claim',
  );

  it('renders correct reward amount in claim button', async () => {
    const { getByTestId } = renderComponent(() => <ClaimRewardButton />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));
    expect(getByTestId(TEST_IDS.claimRewardOpenModalButton).textContent).toMatchInlineSnapshot(
      '"Claim $274.68"',
    );
  });

  it('renders correct reward breakdown in modal', async () => {
    const { getByTestId } = renderComponent(() => <ClaimRewardButton />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardBreakdown)));
    expect(getByTestId(TEST_IDS.claimRewardBreakdown).textContent).toMatchSnapshot();
  });

  it('it disables submit button if user unchecks all groups', async () => {
    const { getByTestId, queryAllByRole } = renderComponent(() => <ClaimRewardButton />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    // Uncheck all groups
    queryAllByRole('checkbox').map(groupCheckbox => fireEvent.click(groupCheckbox));

    await waitFor(() =>
      expect(getByTestId(TEST_IDS.claimRewardSubmitButton).closest('button')).toBeDisabled(),
    );
    expect(getByTestId(TEST_IDS.claimRewardSubmitButton).textContent).toBe(
      en.claimReward.claimButton.disabledLabel,
    );
  });

  it('it claims reward on submit button click and displays successful transaction modal on success', async () => {
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    const { getByTestId } = renderComponent(() => <ClaimRewardButton />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    // Trigger claim
    fireEvent.click(getByTestId(TEST_IDS.claimRewardSubmitButton));

    // TODO: check claim function was called with the right arguments

    await waitFor(() => expect(openSuccessfulTransactionModal).toHaveBeenCalledTimes(1));
    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  it.todo(
    'it claims only selected rewards on submit button click and displays successful transaction modal on success',
  );
});
