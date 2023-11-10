import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { en } from 'packages/translations';
import Vi from 'vitest';

import xvsVaultResponses from '__mocks__/contracts/xvsVault';
import fakeAddress from '__mocks__/models/address';
import { vai } from '__mocks__/models/tokens';
import {
  getXvsVaultLockedDeposits,
  getXvsVaultPoolInfo,
  getXvsVaultUserInfo,
  useGetPrimeStatus,
  useGetPrimeToken,
} from 'clients/api';
import formatToLockedDeposit from 'clients/api/queries/getXvsVaultLockedDeposits/formatToLockedDeposit';
import formatToPoolInfo from 'clients/api/queries/getXvsVaultPoolInfo/formatToPoolInfo';
import formatToUserInfo from 'clients/api/queries/getXvsVaultUserInfo/formatToUserInfo';
import { UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import renderComponent from 'testUtils/renderComponent';

import RequestWithdrawal from '..';
import TEST_IDS from '../../../../TransactionForm/testIds';

const fakeStakedToken = vai;
const fakePoolIndex = 6;

describe('RequestWithdrawal - Feature enabled: Prime', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'prime',
    );

    (getXvsVaultLockedDeposits as Vi.Mock).mockImplementation(() => ({
      lockedDeposits: xvsVaultResponses.getWithdrawalRequests.map(formatToLockedDeposit),
    }));
    (getXvsVaultUserInfo as Vi.Mock).mockImplementation(() =>
      formatToUserInfo(xvsVaultResponses.userInfo),
    );
    (getXvsVaultPoolInfo as Vi.Mock).mockImplementation(() =>
      formatToPoolInfo(xvsVaultResponses.poolInfo),
    );
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
        authContextValue: { accountAddress: fakeAddress },
      },
    );
  });

  it('displays warning when user has revocable Prime token and enters amount that would put their stake below the minimum required to be eligible for Prime', async () => {
    (useGetPrimeToken as Vi.Mock).mockImplementation(() => ({
      data: {
        exists: true,
        isIrrevocable: false,
      },
    }));

    (useGetPrimeStatus as Vi.Mock).mockImplementation(() => ({
      data: {
        // Set minimum stake to the same value as user's current stake, so that entering any amount
        // should display a warning message regarding the loss of Prime token
        primeMinimumStakedXvsMantissa: new BigNumber(xvsVaultResponses.userInfo.amount.toString()),
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
        authContextValue: { accountAddress: fakeAddress },
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
        '"You will lose your Prime token if you withdraw this amount, as your stake in the XVS vault will go below the minimum required of 30.00 XVS to be eligible for Prime."',
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
