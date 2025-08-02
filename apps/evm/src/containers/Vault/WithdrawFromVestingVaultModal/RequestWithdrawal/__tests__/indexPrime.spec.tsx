import { fireEvent, waitFor } from '@testing-library/react';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import {
  getXvsVaultLockedDeposits,
  getXvsVaultPoolInfo,
  getXvsVaultUserInfo,
  useGetPrimeStatus,
  useGetPrimeToken,
} from 'clients/api';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';

import { lockedDeposits, xvsVaultPoolInfo, xvsVaultUserInfo } from '__mocks__/models/vaults';
import RequestWithdrawal from '..';
import TEST_IDS from '../../../TransactionForm/testIds';

const fakeStakedToken = vai;
const fakePoolIndex = 6;

describe('RequestWithdrawal - Feature enabled: Prime', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'prime',
    );

    (getXvsVaultLockedDeposits as Mock).mockImplementation(() => ({
      lockedDeposits,
    }));
    (getXvsVaultUserInfo as Mock).mockImplementation(() => xvsVaultUserInfo);
    (getXvsVaultPoolInfo as Mock).mockImplementation(() => xvsVaultPoolInfo);
  });

  it('renders without crashing', () => {
    renderComponent(
      <RequestWithdrawal
        stakedToken={fakeStakedToken}
        poolIndex={fakePoolIndex}
        handleClose={noop}
        handleDisplayWithdrawalRequestList={noop}
      />,
      {
        accountAddress: fakeAddress,
      },
    );
  });

  it('displays warning when user has revocable Prime token and enters amount that would put their stake below the minimum required to be eligible for Prime', async () => {
    (useGetPrimeToken as Mock).mockImplementation(() => ({
      data: {
        exists: true,
        isIrrevocable: false,
      },
    }));

    (useGetPrimeStatus as Mock).mockImplementation(() => ({
      data: {
        // Set minimum stake to the same value as user's current stake, so that entering any amount
        // should display a warning message regarding the loss of Prime token
        primeMinimumStakedXvsMantissa: xvsVaultUserInfo.stakedAmountMantissa.minus(
          xvsVaultUserInfo.pendingWithdrawalsTotalAmountMantissa,
        ),
        xvsVaultPoolId: fakePoolIndex,
      },
    }));

    const { getByTestId, getByText } = renderComponent(
      <RequestWithdrawal
        stakedToken={fakeStakedToken}
        poolIndex={fakePoolIndex}
        handleClose={vi.fn()}
        handleDisplayWithdrawalRequestList={noop}
      />,
      {
        accountAddress: fakeAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.availableTokens));

    const fakeValueTokens = '10';

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: fakeValueTokens },
    });

    await waitFor(() =>
      expect(getByTestId(TEST_IDS.noticeWarning).textContent).toMatchInlineSnapshot(
        '"You will lose your Prime token if you withdraw this amount, as your stake in the XVS vault will go below the minimum required of 29 XVS to be eligible for Prime."',
      ),
    );

    expect(
      getByText(
        en.withdrawFromVestingVaultModalModal.requestWithdrawalTab.primeLossWarning
          .submitButtonLabel,
      ),
    );
  });
});
