import { fireEvent, waitFor, within } from '@testing-library/react';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { getPendingRewards, useClaimRewards } from 'clients/api';
import { en } from 'libs/translations';

import { ClaimRewardsButton } from '..';
import TEST_IDS from '../../../testIds';
import { fakePendingRewardGroups } from '../__testUtils__/fakeData';

describe('ClaimRewardsButton', () => {
  beforeEach(() => {
    (getPendingRewards as Mock).mockImplementation(() => ({
      pendingRewardGroups: fakePendingRewardGroups,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<ClaimRewardsButton />);
  });

  it('renders nothing if user has not connected any wallet', () => {
    const { queryByTestId } = renderComponent(<ClaimRewardsButton />);

    expect(queryByTestId(TEST_IDS.claimRewardOpenModalButton)).toBeNull();
  });

  it('renders nothing if user has no pending rewards to claim', () => {
    (getPendingRewards as Mock).mockImplementation(() => ({
      pendingRewardGroups: [],
    }));

    const { queryByTestId } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
    });

    expect(queryByTestId(TEST_IDS.claimRewardOpenModalButton)).toBeNull();
  });

  it('renders claim button if user has pending rewards to claim', async () => {
    const { getByTestId } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));
  });

  it('renders correct reward breakdown in modal', async () => {
    const { getByTestId } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardBreakdown)));
    expect(getByTestId(TEST_IDS.claimRewardBreakdown).textContent).toMatchSnapshot();
  });

  it('displays warning message and removes checkbox of vault group when it is disabled', async () => {
    (getPendingRewards as Mock).mockImplementation(() => ({
      pendingRewardGroups: fakePendingRewardGroups.map(fakePendingRewardGroup => {
        if (fakePendingRewardGroup.type !== 'vault') {
          return fakePendingRewardGroup;
        }

        return {
          ...fakePendingRewardGroup,
          isDisabled: true,
        };
      }),
    }));

    const { getByTestId, getByText } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    await waitFor(() =>
      expect(getByText(en.claimReward.modal.vaultGroup.disabledContractWarningMessage)),
    );
  });

  it('displays warning message and removes checkbox of XVS vesting vault group when it is disabled', async () => {
    (getPendingRewards as Mock).mockImplementation(() => ({
      pendingRewardGroups: fakePendingRewardGroups.map(fakePendingRewardGroup => {
        if (fakePendingRewardGroup.type !== 'xvsVestingVault') {
          return fakePendingRewardGroup;
        }

        return {
          ...fakePendingRewardGroup,
          isDisabled: true,
        };
      }),
    }));

    const { getByTestId, getByText } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    await waitFor(() =>
      expect(getByText(en.claimReward.modal.vaultGroup.disabledContractWarningMessage)),
    );
  });

  it('displays warning message and removes checkbox of Prime group when it is disabled', async () => {
    (getPendingRewards as Mock).mockImplementation(() => ({
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

    const { getByTestId, getByText } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    await waitFor(() =>
      expect(getByText(en.claimReward.modal.primeGroup.disabledContractWarningMessage)),
    );
  });

  it('unselects all groups when clicking on "Select all" checkbox and all groups are selected', async () => {
    const { getByTestId } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
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
    const { getByTestId } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
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
    const { getByTestId } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
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

  it('it claims reward on submit button click and closes modal on success', async () => {
    const mockClaimRewards = vi.fn();
    (useClaimRewards as Mock).mockReturnValue({
      mutateAsync: mockClaimRewards,
    });

    const { queryByTestId, getByTestId } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
    });

    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));

    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    // Trigger claim
    fireEvent.click(getByTestId(TEST_IDS.claimRewardSubmitButton));

    await waitFor(() => expect(mockClaimRewards).toHaveBeenCalledTimes(1));
    expect((mockClaimRewards as Mock).mock.calls[0][0]).toMatchSnapshot();

    await waitFor(() => expect(queryByTestId(TEST_IDS.claimRewardSubmitButton)).toBeNull());
  });

  it('it claims only selected and enabled rewards on submit button click on success', async () => {
    const mockClaimRewards = vi.fn();
    (useClaimRewards as Mock).mockReturnValue({
      mutateAsync: mockClaimRewards,
    });

    (getPendingRewards as Mock).mockImplementation(() => ({
      pendingRewardGroups: fakePendingRewardGroups.map(fakePendingRewardGroup => {
        if (fakePendingRewardGroup.type !== 'xvsVestingVault') {
          return fakePendingRewardGroup;
        }

        return {
          ...fakePendingRewardGroup,
          isDisabled: true,
        };
      }),
    }));

    const { getByTestId } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
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

    await waitFor(() => expect(mockClaimRewards).toHaveBeenCalledTimes(1));
    expect((mockClaimRewards as Mock).mock.calls[0][0]).toMatchSnapshot();
  });

  it('renders external rewards if user has pending external rewards to claim', async () => {
    const { getByTestId, queryByText } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
    });
    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));
    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    await waitFor(() => expect(getByTestId(TEST_IDS.claimExternalRewardBreakdown)));

    const fakeExternalRewards = fakePendingRewardGroups.filter(g => g.type === 'external');
    await waitFor(() => expect(queryByText(fakeExternalRewards[0].campaignName)));
    await waitFor(() => expect(queryByText(fakeExternalRewards[1].campaignName)));
  });

  it('does not render external rewards if there is none of this type', async () => {
    (getPendingRewards as Mock).mockImplementation(() => ({
      pendingRewardGroups: fakePendingRewardGroups.filter(g => g.type !== 'external'),
    }));
    const { getByTestId, queryByTestId } = renderComponent(<ClaimRewardsButton />, {
      accountAddress: fakeAddress,
    });
    await waitFor(() => expect(getByTestId(TEST_IDS.claimRewardOpenModalButton)));
    // Open modal
    fireEvent.click(getByTestId(TEST_IDS.claimRewardOpenModalButton));

    await waitFor(() => expect(queryByTestId(TEST_IDS.claimExternalRewardBreakdown)).toBeNull());
  });
});
