import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

import fakeAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { getPendingRewards } from 'clients/api';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import ClaimRewardButton from '..';
import TEST_IDS from '../../testIds';
import { fakePendingRewardGroups } from './fakeData';

jest.mock('clients/api');
jest.mock('hooks/useSuccessfulTransactionModal');

describe('components/Layout/ClaimRewardButton', () => {
  beforeEach(() => {
    (getPendingRewards as jest.Mock).mockImplementation(() => ({
      pendingRewardGroups: fakePendingRewardGroups,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<ClaimRewardButton />);
  });

  it('renders nothing if user has not connected any wallet', () => {
    const { queryByText } = renderComponent(<ClaimRewardButton />);

    expect(queryByText(en.claimReward.openModalButton.label)).toBeNull();
  });

  it('renders nothing if user has no pending rewards to claim', () => {
    (getPendingRewards as jest.Mock).mockImplementation(() => ({
      pendingRewardGroups: [],
    }));

    const { queryByText } = renderComponent(<ClaimRewardButton />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    expect(queryByText(en.claimReward.openModalButton.label)).toBeNull();
  });

  it('renders claim button if user has pending rewards to claim', async () => {
    const { getByTestId } = renderComponent(() => <ClaimRewardButton />, {
      authContextValue: {
        account: {
          address: fakeAddress,
        },
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));
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
