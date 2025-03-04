import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { poolData } from '__mocks__/models/pools';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import {
  type GetMintableVaiOutput,
  getVaiTreasuryPercentage,
  mintVai,
  useGetMintableVai,
  useGetPool,
  useGetTokenUsdPrice,
} from 'clients/api';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { en } from 'libs/translations';
import { convertTokensToMantissa } from 'utilities';

import { Borrow } from '..';

const fakeGetMintableVaiOutput: GetMintableVaiOutput = {
  accountMintableVaiMantissa: new BigNumber('40000000000000000000'),
  vaiLiquidityMantissa: new BigNumber('40000000000000000000'),
};

const fakeVaiTreasuryPercentage = 7.19;

const fakeVaiPriceCents = 100;
const fakeUserBorrowBalanceCents = new BigNumber(fakeVaiPriceCents * 5);
const fakeUserBorrowLimitCents = new BigNumber(fakeVaiPriceCents * 20);

describe('Borrow', () => {
  beforeEach(() => {
    (useGetMintableVai as Mock).mockImplementation(() => ({
      isLoading: false,
      data: fakeGetMintableVaiOutput,
    }));

    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool: {
          ...poolData[0],
          userBorrowBalanceCents: fakeUserBorrowBalanceCents,
          userBorrowLimitCents: fakeUserBorrowLimitCents,
        },
      },
    }));

    (useGetTokenUsdPrice as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        tokenPriceUsd: fakeVaiPriceCents / 100,
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
    (mintVai as Mock).mockImplementation(async () => fakeContractTransaction);

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
    await waitFor(() => expect(mintVai).toHaveBeenCalledTimes(1));
    expect(mintVai).toHaveBeenCalledWith({
      amountMantissa: convertTokensToMantissa({
        value: new BigNumber(fakeValueTokens),
        token: vai,
      }),
    });
  });

  it('lets user borrow 80% of their borrow limit if there is enough VAI liquidity', async () => {
    (mintVai as Mock).mockImplementation(async () => fakeContractTransaction);

    const { getByText, getByPlaceholderText } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.borrow.submitButton.enterValidAmountLabel));
    // Click on "80% LIMIT" button
    const safeMaxButton = getByText(en.vai.borrow.amountTokensInput.limitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(safeMaxButton);

    // Check input value was updated to correct value
    const marginWithSafeLimitTokens = fakeUserBorrowLimitCents
      .multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE / 100)
      .minus(fakeUserBorrowBalanceCents)
      .div(fakeVaiPriceCents);

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() =>
      expect(tokenTextFieldInput.value).toBe(marginWithSafeLimitTokens.toFixed()),
    );

    // Submit repayment request
    expect(getByText(en.vai.borrow.submitButton.borrowLabel));

    const submitButton = getByText(en.vai.borrow.submitButton.borrowLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check mintVai was called correctly
    await waitFor(() => expect(mintVai).toHaveBeenCalledTimes(1));
    expect(mintVai).toHaveBeenCalledWith({
      amountMantissa: convertTokensToMantissa({
        value: new BigNumber(marginWithSafeLimitTokens),
        token: vai,
      }),
    });
  });

  it('displays a warning if user is trying to borrow above safe limit but below hard limit', async () => {
    (mintVai as Mock).mockImplementation(async () => fakeContractTransaction);

    const { getByText, getByPlaceholderText } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.borrow.submitButton.enterValidAmountLabel));

    // Update input value
    const fakeValueTokens = fakeUserBorrowLimitCents
      .multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE / 100)
      .minus(fakeUserBorrowBalanceCents)
      .div(fakeVaiPriceCents)
      .plus(1); // Add 1 token to borrow above safe limit

    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    fireEvent.change(tokenTextFieldInput, { target: { value: fakeValueTokens } });

    // Check warning is displayed
    await waitFor(() => getByText(en.vai.borrow.notice.riskOfLiquidation));

    // Submit repayment request
    expect(getByText(en.vai.borrow.submitButton.borrowAtHighRiskLabel));

    const submitButton = getByText(en.vai.borrow.submitButton.borrowAtHighRiskLabel).closest(
      'button',
    ) as HTMLButtonElement;
    fireEvent.click(submitButton);

    // Check mintVai was called correctly
    await waitFor(() => expect(mintVai).toHaveBeenCalledTimes(1));
    expect(mintVai).toHaveBeenCalledWith({
      amountMantissa: convertTokensToMantissa({
        value: new BigNumber(fakeValueTokens),
        token: vai,
      }),
    });
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
