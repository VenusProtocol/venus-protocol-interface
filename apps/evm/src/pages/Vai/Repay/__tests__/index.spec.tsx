import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { poolData } from '__mocks__/models/pools';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import {
  repayVai,
  useGetBalanceOf,
  useGetLegacyPool,
  useGetTokenUsdPrice,
  useGetVaiRepayAmountWithInterests,
  useGetVaiRepayApr,
} from 'clients/api';
import MAX_UINT256 from 'constants/maxUint256';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import convertTokensToMantissa from 'utilities/convertTokensToMantissa';

import { Repay } from '..';
import TEST_IDS from '../testIds';

vi.mock('hooks/useTokenApproval');

vi.useFakeTimers();

const fakeVaiPriceCents = 100;
const fakeUserBorrowBalanceTokens = new BigNumber(5);
const fakeUserBorrowBalanceMantissa = convertTokensToMantissa({
  token: vai,
  value: fakeUserBorrowBalanceTokens,
});
const fakeUserBorrowBalanceCents = new BigNumber(fakeVaiPriceCents).multipliedBy(
  fakeUserBorrowBalanceTokens,
);
const fakeUserBorrowLimitCents = new BigNumber(fakeVaiPriceCents * 20);

describe('Repay', () => {
  beforeEach(() => {
    (useGetVaiRepayAmountWithInterests as Vi.Mock).mockImplementation(() => ({
      data: {
        vaiRepayAmountWithInterestsMantissa: fakeUserBorrowBalanceMantissa,
      },
      isLoading: false,
    }));

    (useGetBalanceOf as Vi.Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: MAX_UINT256,
      },
      isLoading: false,
    }));

    (useGetVaiRepayApr as Vi.Mock).mockImplementation(() => ({
      data: {
        repayAprPercentage: new BigNumber(1.34),
      },
      isLoading: false,
    }));

    (useGetLegacyPool as Vi.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: {
          ...poolData[0],
          userBorrowBalanceCents: fakeUserBorrowBalanceCents,
          userBorrowLimitCents: fakeUserBorrowLimitCents,
        },
      },
    }));

    (useGetTokenUsdPrice as Vi.Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        tokenPriceUsd: fakeVaiPriceCents / 100,
      },
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Repay />, {
      accountAddress: fakeAccountAddress,
    });
  });

  it('displays the correct repay VAI balance, wallet balance and borrow APY', async () => {
    const { getByTestId, getByText } = renderComponent(<Repay />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.repay.submitButton.enterValidAmountLabel));

    // Check user VAI borrow balance displays correctly
    await waitFor(() =>
      expect(getByTestId(TEST_IDS.userVaiBorrowBalance).textContent).toMatchSnapshot(),
    );
    // Check user VAI balance displays correctly
    expect(getByTestId(TEST_IDS.userVaiWalletBalance).textContent).toMatchSnapshot();
    // Check borrow APY displays correctly
    expect(getByTestId(TEST_IDS.borrowApr).textContent).toMatchSnapshot();
  });

  it('lets user repay some of their VAI loan', async () => {
    (repayVai as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

    const { getByText, getByPlaceholderText } = renderComponent(<Repay />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.repay.submitButton.enterValidAmountLabel));

    const fakeRepayAmountTokens = '1';
    const fakeRepayAmountMantissa = convertTokensToMantissa({
      token: vai,
      value: new BigNumber(fakeRepayAmountTokens),
    });

    // Input amount
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, {
      target: { value: fakeRepayAmountTokens },
    });

    // Check input value updated correctly
    await waitFor(() => expect(tokenTextFieldInput.value).toBe(fakeRepayAmountTokens));

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.repay.submitButton.repayLabel)));
    const submitButton = getByText(en.vai.repay.submitButton.repayLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check repay was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    expect(repayVai).toHaveBeenCalledWith({
      amountMantissa: fakeRepayAmountMantissa,
    });
  });

  it('lets user repay their entire VAI loan', async () => {
    (repayVai as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

    const { getByText, getByPlaceholderText } = renderComponent(<Repay />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.repay.submitButton.enterValidAmountLabel));

    // Click on max button
    fireEvent.click(getByText(en.vai.repay.amountTokensInput.limitButtonLabel));

    // Check input value updated correctly
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() =>
      expect(tokenTextFieldInput.value).toBe(fakeUserBorrowBalanceTokens.toString()),
    );

    // Check warning notice is displayed
    expect(getByText(en.vai.repay.notice.fullRepaymentWarning)).toBeInTheDocument();

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.repay.submitButton.repayLabel)));

    const submitButton = getByText(en.vai.repay.submitButton.repayLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check repay was called correctly
    await waitFor(() => expect(repayVai).toHaveBeenCalledTimes(1));
    expect(repayVai).toHaveBeenCalledWith({
      amountMantissa: MAX_UINT256,
    });
  });

  it('does not let user repay more than their VAI borrow balance', async () => {
    const { getByText, getByPlaceholderText } = renderComponent(<Repay />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.repay.submitButton.enterValidAmountLabel));

    // Input amount
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, {
      target: { value: fakeUserBorrowBalanceTokens.plus(1) },
    });

    // Check error notice is displayed
    await waitFor(() =>
      expect(getByText(en.vai.repay.notice.amountHigherThanBorrowBalance)).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await waitFor(() => getByText(en.vai.repay.submitButton.enterValidAmountLabel));
    expect(
      getByText(en.vai.repay.submitButton.enterValidAmountLabel).closest('button'),
    ).toBeDisabled();
  });

  it('does not let user repay more than their VAI wallet balance', async () => {
    const fakeUserVaiWalletBalanceTokens = fakeUserBorrowBalanceTokens.minus(2);
    (useGetBalanceOf as Vi.Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: convertTokensToMantissa({
          token: vai,
          value: fakeUserVaiWalletBalanceTokens,
        }),
      },
      isLoading: false,
    }));

    const { getByText, getByPlaceholderText } = renderComponent(<Repay />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.repay.submitButton.enterValidAmountLabel));

    // Input amount
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, {
      target: { value: fakeUserVaiWalletBalanceTokens.plus(1) },
    });

    // Check error notice is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.vai.repay.notice.amountHigherThanWalletBalance.replace('{{tokenSymbol}}', vai.symbol),
        ),
      ).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await waitFor(() => getByText(en.vai.repay.submitButton.enterValidAmountLabel));
    expect(
      getByText(en.vai.repay.submitButton.enterValidAmountLabel).closest('button'),
    ).toBeDisabled();
  });

  it('does not let user repay more than their VAI wallet spending limit', async () => {
    const fakeUserVaiWalletSpendingLimitTokens = fakeUserBorrowBalanceTokens.minus(2);

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      isTokenApproved: true,
      isWalletSpendingLimitLoading: false,
      isApproveTokenLoading: false,
      isRevokeWalletSpendingLimitLoading: false,
      walletSpendingLimitTokens: fakeUserVaiWalletSpendingLimitTokens,
      approveToken: vi.fn(),
      revokeWalletSpendingLimit: vi.fn(),
    }));

    const { getByText, getByPlaceholderText } = renderComponent(<Repay />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.repay.submitButton.enterValidAmountLabel));

    // Input amount
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, {
      target: { value: fakeUserVaiWalletSpendingLimitTokens.plus(1) },
    });

    // Check error notice is displayed
    await waitFor(() =>
      expect(
        getByText(en.vai.repay.notice.amountHigherThanWalletSpendingLimit),
      ).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await waitFor(() => getByText(en.vai.repay.submitButton.enterValidAmountLabel));
    expect(
      getByText(en.vai.repay.submitButton.enterValidAmountLabel).closest('button'),
    ).toBeDisabled();
  });
});
