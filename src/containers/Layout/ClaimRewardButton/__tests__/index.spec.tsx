import { fireEvent, waitFor, within } from '@testing-library/react';
import { en } from 'packages/translations';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { claimRewards, getPendingRewards } from 'clients/api';
import renderComponent from 'testUtils/renderComponent';

import ClaimRewardButton from '..';
import TEST_IDS from '../../testIds';
import { fakePendingRewardGroups } from '../__testUtils__/fakeData';

describe('ClaimRewardButton', () => {
  beforeEach(() => {
    (getPendingRewards as Vi.Mock).mockImplementation(() => ({
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
    (getPendingRewards as Vi.Mock).mockImplementation(() => ({
      pendingRewardGroups: [],
    }));

    const { queryByText } = renderComponent(<ClaimRewardButton />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    expect(queryByText(en.claimReward.openModalButton.label)).toBeNull();
  });

  it('renders claim button if user has pending rewards to claim', async () => {
    const { getByTestId } = renderComponent(<ClaimRewardButton />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));
  });

  it('renders correct reward breakdown in modal', async () => {
    const { getByTestId } = renderComponent(<ClaimRewardButton />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardBreakdown)));
    expect(getByTestId(TEST_IDS.claimRewardBreakdown).textContent).toMatchSnapshot();
  });

  it('displays warning message and removes checkbox of Prime group when Prime group is disabled', async () => {
    (getPendingRewards as Vi.Mock).mockImplementation(() => ({
      pendingRewardGroups: fakePendingRewardGroups.map(fakePendingRewardGroup => {
        if (fakePendingRewardGroup.type !== 'prime') {
          return fakePendingRewardGroup;
        }

        return {
          ...fakePendingRewardGroup,
          isDisabled: true,
        };
      }),
    }));

    const { getByTestId, getByText } = renderComponent(<ClaimRewardButton />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    await waitFor(() =>
      expect(getByText(en.layout.claimRewardModal.primeGroup.disabledContractWarningMessage)),
    );
  });

  it('unselects all groups when clicking on "Select all" checkbox and all groups are selected', async () => {
    const { getByTestId } = renderComponent(<ClaimRewardButton />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    // Uncheck "Select all" checkbox
    fireEvent.click(
      within(getByTestId(TEST_IDS.claimRewardSelectAllCheckbox)).getByRole('checkbox'),
    );

    // Check all groups were unselected
    within(getByTestId(TEST_IDS.claimRewardBreakdown))
      .queryAllByRole('checkbox')
      .forEach(checkbox => {
        expect((checkbox as HTMLInputElement).checked).toEqual(false);
      });
  });

  it('selects all groups when clicking on "Select all" checkbox and some groups are unselected', async () => {
    const { getByTestId } = renderComponent(<ClaimRewardButton />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    // Unselect some reward groups
    const checkboxes = within(getByTestId(TEST_IDS.claimRewardBreakdown)).queryAllByRole(
      'checkbox',
    );
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[2]);

    // Check "Select all" checkbox
    fireEvent.click(
      within(getByTestId(TEST_IDS.claimRewardSelectAllCheckbox)).getByRole('checkbox'),
    );

    // Check all groups were selected
    within(getByTestId(TEST_IDS.claimRewardBreakdown))
      .queryAllByRole('checkbox')
      .forEach(checkbox => {
        expect((checkbox as HTMLInputElement).checked).toEqual(true);
      });
  });

  it('it disables submit button if user unchecks all groups', async () => {
    const { getByTestId } = renderComponent(<ClaimRewardButton />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    // Uncheck all groups
    within(getByTestId(TEST_IDS.claimRewardBreakdown))
      .queryAllByRole('checkbox')
      .map(groupCheckbox => fireEvent.click(groupCheckbox));

    await waitFor(() =>
      expect(getByTestId(TEST_IDS.claimRewardSubmitButton).closest('button')).toBeDisabled(),
    );
    expect(getByTestId(TEST_IDS.claimRewardSubmitButton).textContent).toBe(
      en.claimReward.modal.claimButton.disabledLabel,
    );
  });

  it('it claims reward on submit button click on success', async () => {
    (claimRewards as Vi.Mock).mockImplementationOnce(() => fakeContractTransaction);

    const { getByTestId } = renderComponent(<ClaimRewardButton />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    // Trigger claim
    fireEvent.click(getByTestId(TEST_IDS.claimRewardSubmitButton));

    await waitFor(() => expect(claimRewards).toHaveBeenCalledTimes(1));
    expect((claimRewards as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();
  });

  it('it claims only selected rewards on submit button click on success', async () => {
    (claimRewards as Vi.Mock).mockImplementationOnce(() => fakeContractTransaction);

    const { getByTestId } = renderComponent(<ClaimRewardButton />, {
      authContextValue: {
        accountAddress: fakeAddress,
      },
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    // Unselect some reward groups
    const checkboxes = within(getByTestId(TEST_IDS.claimRewardBreakdown)).queryAllByRole(
      'checkbox',
    );
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[2]);

    // Trigger claim
    fireEvent.click(getByTestId(TEST_IDS.claimRewardSubmitButton));

    await waitFor(() => expect(claimRewards).toHaveBeenCalledTimes(1));
    expect((claimRewards as Vi.Mock).mock.calls[0][0]).toMatchSnapshot();
  });
});
