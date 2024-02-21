import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import vaiContractResponses from '__mocks__/contracts/vai';
import vaiControllerResponses from '__mocks__/contracts/vaiController';
import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { poolData } from '__mocks__/models/pools';
import { vai } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import {
  getMintableVai,
  getVaiTreasuryPercentage,
  mintVai,
  useGetLegacyPool,
  useGetTokenUsdPrice,
} from 'clients/api';
import formatToMintableVaiOutput from 'clients/api/queries/getMintableVai/formatToOutput';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { en } from 'libs/translations';
import { convertTokensToMantissa } from 'utilities';

import { Borrow } from '..';

const fakeFormatToMintableVaiInput = {
  mintCapResponse: vaiControllerResponses.mintCap,
  vaiTotalSupplyResponse: vaiContractResponses.totalSupply,
  accountMintableVaiResponse: vaiControllerResponses.getMintableVAI,
};

const fakeGetMintableVaiOutput = formatToMintableVaiOutput(fakeFormatToMintableVaiInput);

const fakeVaiTreasuryPercentage = 7.19;

const fakeVaiPriceCents = 100;
const fakeUserBorrowBalanceCents = new BigNumber(fakeVaiPriceCents * 5);
const fakeUserBorrowLimitCents = new BigNumber(fakeVaiPriceCents * 20);

describe('Borrow', () => {
  beforeEach(() => {
    (getMintableVai as Vi.Mock).mockImplementation(() => fakeGetMintableVaiOutput);

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
    renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
  });

  it('displays the correct available VAI limit and borrow fee', async () => {
    (getVaiTreasuryPercentage as Vi.Mock).mockImplementationOnce(async () => ({
      percentage: fakeVaiTreasuryPercentage,
    }));

    const { getByText } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });

    // Check available VAI limit displays correctly
    await waitFor(() => getByText('40.00 VAI'));
    // Check borrow fee displays correctly
    await waitFor(() => getByText(`0 VAI (${fakeVaiTreasuryPercentage.toString()}%)`));
  });

  it('lets user borrow VAI', async () => {
    (mintVai as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

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

  it('lets user borrow up to 80% of their borrow limit if there is enough VAI liquidity', async () => {
    (mintVai as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

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
    await waitFor(() => expect(getByText(en.vai.borrow.submitButton.borrowLabel)));

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

  it('does not let user borrow VAI if there is no VAI left to borrow', async () => {
    // mock getMintableVai, simulating that the total supply has reached the cap
    const fakeGetMintableVaiOutputToppedCap = formatToMintableVaiOutput({
      ...fakeFormatToMintableVaiInput,
      vaiTotalSupplyResponse: fakeFormatToMintableVaiInput.mintCapResponse,
    });
    (getMintableVai as Vi.Mock).mockImplementation(() => fakeGetMintableVaiOutputToppedCap);

    const { getByText, getByPlaceholderText } = renderComponent(<Borrow />, {
      accountAddress: fakeAccountAddress,
    });
    await waitFor(() => getByText(en.vai.borrow.submitButton.enterValidAmountLabel));

    // Check if the "80% LIMIT" button is disabled
    const safeMaxButton = getByText(en.vai.borrow.amountTokensInput.limitButtonLabel).closest(
      'button',
    ) as HTMLButtonElement;
    await waitFor(() => expect(safeMaxButton).toBeDisabled());

    // Check if the input is disabled
    const tokenTextFieldInput = getByPlaceholderText('0.00') as HTMLInputElement;
    await waitFor(() => expect(tokenTextFieldInput).toBeDisabled());
  });
});
