import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import {
  type GetMintableVaiOutput,
  getVaiTreasuryPercentage,
  useGetMintableVai,
  useGetPool,
  useMintVai,
} from 'clients/api';
import { en } from 'libs/translations';
import { convertTokensToMantissa } from 'utilities';

import {
  HEALTH_FACTOR_MODERATE_THRESHOLD,
  HEALTH_FACTOR_SAFE_MAX_THRESHOLD,
} from 'constants/healthFactor';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import type { BalanceMutation, Pool } from 'types';
import { Borrow } from '..';

const fakeGetMintableVaiOutput: GetMintableVaiOutput = {
  accountMintableVaiMantissa: new BigNumber('40000000000000000000'),
  vaiLiquidityMantissa: new BigNumber('40000000000000000000'),
};

const fakeVaiTreasuryPercentage = 7.19;

const fakeVaiPriceCents = 100;
const fakeUserBorrowBalanceTokens = new BigNumber(5);
const fakeUserBorrowBalanceCents = new BigNumber(fakeVaiPriceCents).multipliedBy(
  fakeUserBorrowBalanceTokens,
);
const fakeUserBorrowLimitCents = new BigNumber(fakeVaiPriceCents * 20);
const fakeUserLiquidationThresholdCents = new BigNumber(fakeVaiPriceCents * 22);

const fakePool: Pool = {
  ...poolData[0],
  userBorrowBalanceCents: fakeUserBorrowBalanceCents,
  userBorrowLimitCents: fakeUserBorrowLimitCents,
  userLiquidationThresholdCents: fakeUserLiquidationThresholdCents,
};

describe('Borrow', () => {
  beforeEach(() => {
    (useGetMintableVai as Mock).mockImplementation(() => ({
      isLoading: false,
      data: fakeGetMintableVaiOutput,
    }));

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: fakePool,
      },
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
  });

  it('displays the correct available VAI limit and borrow fee', async () => {
    (getVaiTreasuryPercentage as Mock).mockImplementation(async () => ({
      percentage: fakeVaiTreasuryPercentage,
    }));

    const { getByText, getByPlaceholderText } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.borrow.submitButton.enterValidAmountLabel));

    const fakeValueTokens = '10';

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeValueTokens } });

    // Check available VAI limit displays correctly
    await waitFor(() => getByText('40 VAI'));
    // Check borrow fee displays correctly
    await waitFor(() => getByText(`0.719 VAI (${fakeVaiTreasuryPercentage.toString()}%)`));
  });

  it('lets user borrow VAI', async () => {
    const mockMintVai = vi.fn();
    (useMintVai as Mock).mockImplementation(() => ({
      mutateAsync: mockMintVai,
    }));

    const { getByText, getByPlaceholderText } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.borrow.submitButton.enterValidAmountLabel));

    // Update input value
    const fakeValueTokens = '1';

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeValueTokens } });

    // Submit repayment request
    await waitFor(() => expect(getByText(en.vai.borrow.submitButton.borrowLabel)));

    const submitButton = getByText(en.vai.borrow.submitButton.borrowLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check mintVai was called correctly
    await waitFor(() => expect(mockMintVai).toHaveBeenCalledTimes(1));
    expect(mockMintVai).toHaveBeenCalledWith({
      amountMantissa: convertTokensToMantissa({
        value: new BigNumber(fakeValueTokens),
        token: vai,
      }),
    });
  });

  it('lets user borrow up to their safe borrow limit if there is enough VAI liquidity', async () => {
    const mockMintVai = vi.fn();
    (useMintVai as Mock).mockImplementation(() => ({
      mutateAsync: mockMintVai,
    }));

    const { getByText, getByPlaceholderText } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.borrow.submitButton.enterValidAmountLabel));
    // Click on max button
    const safeMaxButton = getByText(en.vai.borrow.amountTokensInput.limitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(safeMaxButton);

    // Check input value was updated to correct value
    const marginWithSafeLimitTokens = fakeUserBorrowLimitCents
      .div(HEALTH_FACTOR_SAFE_MAX_THRESHOLD)
      .minus(fakeUserBorrowBalanceCents)
      .div(fakeVaiPriceCents)
      .dp(vai.decimals);

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() =>
      expect(tokenTextFieldInput.value).toBe(marginWithSafeLimitTokens.toFixed()),
    );

    // Submit borrow request
    expect(getByText(en.vai.borrow.submitButton.borrowLabel));

    const submitButton = getByText(en.vai.borrow.submitButton.borrowLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check mintVai was called correctly
    await waitFor(() => expect(mockMintVai).toHaveBeenCalledTimes(1));
    expect(mockMintVai).toHaveBeenCalledWith({
      amountMantissa: convertTokensToMantissa({
        value: new BigNumber(marginWithSafeLimitTokens),
        token: vai,
      }),
    });
  });

  it('prompts user to acknowledge risk if requested borrow lowers health factor to risky threshold', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      userHealthFactor: HEALTH_FACTOR_MODERATE_THRESHOLD - 0.01,
    };

    (useSimulateBalanceMutations as Mock).mockImplementation(
      ({ balanceMutations }: { balanceMutations: BalanceMutation[] }) => ({
        isLoading: false,
        data: {
          pool: balanceMutations.length > 0 ? customFakePool : fakePool,
        },
      }),
    );

    const { getByText, getByPlaceholderText, getByRole } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.borrow.submitButton.enterValidAmountLabel));

    // Update input value
    const inputValue = fakeUserLiquidationThresholdCents
      .div(HEALTH_FACTOR_MODERATE_THRESHOLD - 0.01)
      .minus(fakeUserBorrowBalanceCents)
      .plus(1)
      // Convert cents to tokens
      .dividedBy(fakeVaiPriceCents)
      .toFixed(0, BigNumber.ROUND_CEIL);

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: inputValue } });

    // Check submit button is disabled
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.vai.borrow.submitButton.borrowLabel),
    );
    expect(submitButton).toBeDisabled();

    // Toggle acknowledgement
    const toggle = getByRole('checkbox');
    fireEvent.click(toggle);

    await waitFor(() => expect(document.querySelector('button[type="submit"]')).toBeEnabled());
  });

  it('does not let user borrow more than available liquidity', async () => {
    (useGetMintableVai as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        ...fakeGetMintableVaiOutput,
        vaiLiquidityMantissa: new BigNumber(0),
      },
    }));

    const { getByText, getByPlaceholderText } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.borrow.submitButton.enterValidAmountLabel));

    // Update input value
    const fakeValueTokens = '1';

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeValueTokens } });

    // Check error is displayed
    await waitFor(() => getByText(en.vai.borrow.notice.amountHigherThanLiquidity));

    // Check submit button is disabled
    const submitButton = getByText(en.vai.borrow.submitButton.enterValidAmountLabel).closest(
      'button',
    ) as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });

  it('does not let user borrow more than their borrow limit allows', async () => {
    (useGetMintableVai as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        ...fakeGetMintableVaiOutput,
        accountMintableVaiMantissa: new BigNumber(0),
      },
    }));

    const { getByText, getByPlaceholderText } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.borrow.submitButton.enterValidAmountLabel));

    // Update input value
    const fakeValueTokens = '1';

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeValueTokens } });

    // Check error is displayed
    await waitFor(() => getByText(en.vai.borrow.notice.amountHigherThanAccountMintableAmount));

    // Check submit button is disabled
    const submitButton = getByText(en.vai.borrow.submitButton.enterValidAmountLabel).closest(
      'button',
    ) as HTMLButtonElement;
    expect(submitButton).toBeDisabled();
  });
});
