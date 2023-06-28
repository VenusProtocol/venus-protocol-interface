import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import React from 'react';
import { Asset, Pool } from 'types';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import { borrow } from 'clients/api';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';

import BorrowForm from '..';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('clients/api');
vi.mock('hooks/useSuccessfulTransactionModal');

describe('hooks/useBorrowRepayModal/BorrowForm', () => {
  it('renders without crashing', () => {
    renderComponent(<BorrowForm asset={fakeAsset} pool={fakePool} onCloseModal={noop} />);
  });

  it('renders correct token borrowable amount when asset liquidity is higher than maximum amount of tokens user can borrow before reaching their borrow limit', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      liquidityCents: new BigNumber(100000000),
    };

    const { getByText } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    const borrowDeltaCents = fakePool.userBorrowLimitCents!.minus(fakePool.userBorrowBalanceCents!);
    const borrowDeltaTokens = new BigNumber(borrowDeltaCents).dividedBy(fakeAsset.tokenPriceCents);

    await waitFor(() =>
      getByText(`${borrowDeltaTokens.toFixed(2)} ${customFakeAsset.vToken.underlyingToken.symbol}`),
    );
  });

  it('renders correct token borrowable amount when asset liquidity is lower than maximum amount of tokens user can borrow before reaching their borrow limit', async () => {
    const customFakeAsset = {
      ...fakeAsset,
      liquidityCents: new BigNumber(50),
    };

    const { getByText } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() =>
      getByText(
        `${customFakeAsset.liquidityCents.dividedBy(100).toFixed(2)} ${
          customFakeAsset.vToken.underlyingToken.symbol
        }`,
      ),
    );
  });

  it('disables form and displays a warning notice if the borrow cap of this market has been reached', async () => {
    const customFakeAsset = {
      ...fakeAsset,
      borrowCapTokens: new BigNumber(100),
      borrowBalanceTokens: new BigNumber(100),
    };

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    // Check warning is displayed
    await waitFor(() => getByTestId(TEST_IDS.notice));
    expect(getByTestId(TEST_IDS.notice).textContent).toMatchInlineSnapshot(
      '"The borrow cap of 100.00 XVS has been reached for this pool. You can not borrow from this market anymore until loans are repaid or its borrow cap is increased."',
    );

    // Check submit button is disabled
    expect(
      getByText(en.operationModal.borrow.submitButtonLabel.borrowCapReached).closest('button'),
    ).toBeDisabled();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();
  });

  it('disables form and displays a warning notice if user has not supplied and collateralize any tokens yet', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      userBorrowLimitCents: new BigNumber(0),
      userBorrowBalanceCents: new BigNumber(0),
      assets: fakePool.assets.map(asset => ({
        ...asset,
        isCollateralOfUser: false,
      })),
    };

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={customFakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount));

    // Check warning is displayed
    await waitFor(() => getByTestId(TEST_IDS.notice));
    expect(getByTestId(TEST_IDS.notice).textContent).toMatchInlineSnapshot(
      '"You need to supply tokens and enable them as collateral before you can borrow XVS from this pool"',
    );

    // Check submit button is disabled
    expect(
      getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();
  });

  it('disables submit button and displays a warning notice if an amount entered is higher than asset liquidity', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      liquidityCents: new BigNumber(200),
    };

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount));

    expect(
      getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    const incorrectValueTokens = new BigNumber(customFakeAsset.liquidityCents)
      .dividedBy(customFakeAsset.tokenPriceCents)
      // Add one token more than the available liquidity
      .plus(1)
      .dp(customFakeAsset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    await waitFor(() => getByTestId(TEST_IDS.notice));
    expect(getByTestId(TEST_IDS.notice).textContent).toMatchInlineSnapshot(
      '"Insufficient asset liquidity"',
    );

    await waitFor(() =>
      getByText(en.operationModal.borrow.submitButtonLabel.amountHigherThanBorrowableAmount),
    );
    expect(
      getByText(
        en.operationModal.borrow.submitButtonLabel.amountHigherThanBorrowableAmount,
      ).closest('button'),
    ).toBeDisabled();
  });

  it('disables submit button and displays a warning notice if an amount entered is higher than asset borrow cap', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      borrowCapTokens: new BigNumber(100),
      borrowBalanceTokens: new BigNumber(10),
    };

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount));

    expect(
      getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    const incorrectValueTokens = new BigNumber(customFakeAsset.borrowCapTokens!)
      .minus(customFakeAsset.borrowBalanceTokens)
      // Add one token too much
      .plus(1)
      .toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    await waitFor(() => getByTestId(TEST_IDS.notice));
    expect(getByTestId(TEST_IDS.notice).textContent).toMatchInlineSnapshot(
      '"You can not borrow more than 90.00 XVS from this pool, as the borrow cap for this market is set at 100.00 XVS and 10.00 XVS are currently being borrowed from it."',
    );

    await waitFor(() =>
      getByText(en.operationModal.borrow.submitButtonLabel.amountHigherThanBorrowCap),
    );
    expect(
      getByText(en.operationModal.borrow.submitButtonLabel.amountHigherThanBorrowCap).closest(
        'button',
      ),
    ).toBeDisabled();
  });

  it('disables submit button if amount to borrow requested would make user borrow balance go higher than their borrow limit', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount));

    // Check submit button is disabled
    expect(
      getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    const fakeBorrowDeltaCents = fakePool.userBorrowLimitCents!.minus(
      fakePool.userBorrowBalanceCents!,
    );

    const incorrectValueTokens = new BigNumber(fakeBorrowDeltaCents)
      .dividedBy(fakeAsset.tokenPriceCents)
      // Add one token more than the maximum
      .plus(1)
      .dp(fakeAsset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: incorrectValueTokens },
    });

    // Check submit button is still disabled
    await waitFor(() =>
      getByText(en.operationModal.borrow.submitButtonLabel.amountHigherThanBorrowableAmount),
    );
    expect(
      getByText(
        en.operationModal.borrow.submitButtonLabel.amountHigherThanBorrowableAmount,
      ).closest('button'),
    ).toBeDisabled();
  });

  it('displays warning notice if amount to borrow requested would bring user borrow balance at safe borrow limit', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount));

    expect(
      getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    const safeBorrowLimitCents = fakePool
      .userBorrowLimitCents!.times(SAFE_BORROW_LIMIT_PERCENTAGE)
      .dividedBy(100);
    const marginWithSafeBorrowLimitCents = safeBorrowLimitCents.minus(
      fakePool.userBorrowBalanceCents!,
    );
    const safeMaxTokens = marginWithSafeBorrowLimitCents.dividedBy(fakeAsset.tokenPriceCents);

    const riskyValueTokens = safeMaxTokens
      // Add one token to safe borrow limit
      .plus(1)
      .dp(fakeAsset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: riskyValueTokens },
    });

    await waitFor(() => getByTestId(TEST_IDS.notice));
    expect(getByTestId(TEST_IDS.notice).textContent).toMatchInlineSnapshot(
      '"You entered a high value. There is a risk of liquidation."',
    );

    await waitFor(() => getByText(en.operationModal.borrow.submitButtonLabel.borrowHighRiskAmount));
    expect(
      getByText(en.operationModal.borrow.submitButtonLabel.borrowHighRiskAmount).closest('button'),
    ).toBeEnabled();
  });

  it('updates input value correctly when pressing on max button', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount));

    // Check input is empty
    const input = getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement;
    expect(input.value).toBe('');

    // Press on max button
    fireEvent.click(getByText(`${SAFE_BORROW_LIMIT_PERCENTAGE}% LIMIT`));

    const safeUserBorrowLimitCents = new BigNumber(fakePool.userBorrowLimitCents!)
      .multipliedBy(SAFE_BORROW_LIMIT_PERCENTAGE)
      .dividedBy(100);
    const safeBorrowDeltaCents = safeUserBorrowLimitCents.minus(fakePool.userBorrowBalanceCents!);
    const safeBorrowDeltaTokens = safeBorrowDeltaCents.dividedBy(fakeAsset.tokenPriceCents);
    const expectedInputValue = safeBorrowDeltaTokens
      .dp(fakeAsset.vToken.underlyingToken.decimals)
      .toFixed();

    await waitFor(() => expect(input.value).toBe(expectedInputValue));

    // Check submit button is enabled
    expect(
      getByText(en.operationModal.borrow.submitButtonLabel.borrowHighRiskAmount).closest('button'),
    ).toBeEnabled();
  });

  it('lets user borrow tokens, then displays successful transaction modal and calls onClose callback on success', async () => {
    const onCloseMock = vi.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    (borrow as Vi.Mock).mockImplementationOnce(async () => fakeContractReceipt);

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onCloseModal={onCloseMock} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );
    await waitFor(() => getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount));

    expect(
      getByText(en.operationModal.borrow.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    // Enter amount in input
    const correctAmountTokens = 1;
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: correctAmountTokens },
    });

    // Click on submit button
    await waitFor(() => getByText(en.operationModal.borrow.submitButtonLabel.borrow));
    fireEvent.click(getByText(en.operationModal.borrow.submitButtonLabel.borrow));

    const expectedAmountWei = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(borrow).toHaveBeenCalledTimes(1));
    expect(borrow).toHaveBeenCalledWith({
      amountWei: expectedAmountWei,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);

    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: fakeAsset.vToken.underlyingToken,
        valueWei: expectedAmountWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });
});
