import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import _cloneDeep from 'lodash/cloneDeep';
import noop from 'noop-ts';
import React from 'react';
import { Asset, Swap, TokenBalance } from 'types';
import { isFeatureEnabled } from 'utilities';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractReceipt from '__mocks__/models/contractReceipt';
import fakeTokenBalances, { FAKE_BUSD_BALANCE_TOKENS } from '__mocks__/models/tokenBalances';
import { selectToken } from 'components/SelectTokenTextField/__tests__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import { PANCAKE_SWAP_TOKENS, TESTNET_TOKENS } from 'constants/tokens';
import useGetSwapInfo, { UseGetSwapInfoInput } from 'hooks/useGetSwapInfo';
import useGetSwapTokenUserBalances from 'hooks/useGetSwapTokenUserBalances';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import renderComponent from 'testUtils/renderComponent';
import en from 'translation/translations/en.json';
import originalIsFeatureEnabledMock from 'utilities/__mocks__/isFeatureEnabled';

import Repay, { PRESET_PERCENTAGES } from '..';
import TEST_IDS from '../testIds';
import { fakeAsset, fakePool } from './fakeData';

const fakeBusdWalletBalanceWei = new BigNumber(FAKE_BUSD_BALANCE_TOKENS).multipliedBy(
  new BigNumber(10).pow(PANCAKE_SWAP_TOKENS.busd.decimals),
);

const fakeBusdAmountBellowWalletBalanceWei = fakeBusdWalletBalanceWei.minus(100);

const fakeXvsUserBorrowBalanceInWei = new BigNumber(fakeAsset.userBorrowBalanceTokens).multipliedBy(
  new BigNumber(10).pow(TESTNET_TOKENS.xvs.decimals),
);

const fakeXvsAmountBelowUserBorrowBalanceWei = fakeXvsUserBorrowBalanceInWei.minus(100);

const fakeSwap: Swap = {
  fromToken: PANCAKE_SWAP_TOKENS.busd,
  fromTokenAmountSoldWei: fakeBusdAmountBellowWalletBalanceWei,
  toToken: TESTNET_TOKENS.xvs,
  expectedToTokenAmountReceivedWei: fakeXvsAmountBelowUserBorrowBalanceWei,
  minimumToTokenAmountReceivedWei: fakeXvsAmountBelowUserBorrowBalanceWei,
  exchangeRate: fakeXvsAmountBelowUserBorrowBalanceWei.div(fakeBusdAmountBellowWalletBalanceWei),
  routePath: [PANCAKE_SWAP_TOKENS.busd.address, TESTNET_TOKENS.xvs.address],
  direction: 'exactAmountIn',
};

// Fake full repayment swap in which the wallet balance covers exactly the entire user loan
const fakeFullRepaymentSwap: Swap = {
  fromToken: PANCAKE_SWAP_TOKENS.busd,
  expectedFromTokenAmountSoldWei: fakeBusdWalletBalanceWei,
  maximumFromTokenAmountSoldWei: fakeBusdWalletBalanceWei,
  toToken: TESTNET_TOKENS.xvs,
  toTokenAmountReceivedWei: fakeXvsUserBorrowBalanceInWei,
  exchangeRate: fakeXvsUserBorrowBalanceInWei.div(fakeBusdWalletBalanceWei),
  routePath: [PANCAKE_SWAP_TOKENS.busd.address, TESTNET_TOKENS.xvs.address],
  direction: 'exactAmountOut',
};

jest.mock('clients/api');
jest.mock('hooks/useGetSwapTokenUserBalances');
jest.mock('hooks/useSuccessfulTransactionModal');
jest.mock('hooks/useGetSwapInfo');

describe('hooks/useBorrowRepayModal/Repay - Feature flag enabled: integratedSwap', () => {
  beforeEach(() => {
    (isFeatureEnabled as jest.Mock).mockImplementation(
      featureFlag => featureFlag === 'integratedSwap',
    );

    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap: undefined,
      error: undefined,
      isLoading: false,
    }));

    (useGetSwapTokenUserBalances as jest.Mock).mockImplementation(() => ({
      data: fakeTokenBalances,
    }));
  });

  afterEach(() => {
    (isFeatureEnabled as jest.Mock).mockRestore();
    (isFeatureEnabled as jest.Mock).mockImplementation(originalIsFeatureEnabledMock);
  });

  it('renders without crashing', () => {
    renderComponent(<Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />);
  });

  it('displays correct wallet balance', async () => {
    const { getByText, container } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    await waitFor(() =>
      getByText(
        `${new BigNumber(FAKE_BUSD_BALANCE_TOKENS).toFormat()} ${PANCAKE_SWAP_TOKENS.busd.symbol}`,
      ),
    );
  });

  it('disables form if no amount was entered in input', async () => {
    const { getByText } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonLabel.enterValidAmount));
    expect(
      getByText(en.borrowRepayModal.repay.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();
  });

  it('disables submit button if swap is a wrap', async () => {
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap: undefined,
      error: 'WRAPPING_UNSUPPORTED',
      isLoading: false,
    }));

    const customFakeAsset: Asset = {
      ...fakeAsset,
      vToken: {
        ...fakeAsset.vToken,
        underlyingToken: PANCAKE_SWAP_TOKENS.wbnb,
      },
    };

    const { getByText, container, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.bnb,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonLabel.wrappingUnsupported));
    expect(
      getByText(en.borrowRepayModal.repay.submitButtonLabel.wrappingUnsupported).closest('button'),
    ).toBeDisabled();
  });

  it('disables submit button if swap is an unwrap', async () => {
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap: undefined,
      error: 'UNWRAPPING_UNSUPPORTED',
      isLoading: false,
    }));

    const customFakeAsset: Asset = {
      ...fakeAsset,
      vToken: {
        ...fakeAsset.vToken,
        underlyingToken: PANCAKE_SWAP_TOKENS.bnb,
      },
    };

    const { getByText, container, getByTestId } = renderComponent(
      <Repay asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.wbnb,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    await waitFor(() =>
      getByText(en.borrowRepayModal.repay.submitButtonLabel.unwrappingUnsupported),
    );
    expect(
      getByText(en.borrowRepayModal.repay.submitButtonLabel.unwrappingUnsupported).closest(
        'button',
      ),
    ).toBeDisabled();
  });

  it('disables submit button if no swap is found', async () => {
    (useGetSwapInfo as jest.Mock).mockImplementation(() => ({
      swap: undefined,
      error: 'INSUFFICIENT_LIQUIDITY',
      isLoading: false,
    }));

    const { getByTestId, getByText } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: '1' } });

    await waitFor(() =>
      getByText(en.borrowRepayModal.repay.submitButtonLabel.insufficientSwapLiquidity),
    );
    expect(
      getByText(en.borrowRepayModal.repay.submitButtonLabel.insufficientSwapLiquidity).closest(
        'button',
      ),
    ).toBeDisabled();
  });

  it('disables submit button if amount entered in input is higher than wallet balance', async () => {
    const { container, getByTestId, getByText } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter invalid amount in input
    const invalidAmount = `${Number(FAKE_BUSD_BALANCE_TOKENS) + 1}`;
    fireEvent.change(selectTokenTextField, { target: { value: invalidAmount } });

    const expectedSubmitButtonLabel =
      en.borrowRepayModal.repay.submitButtonLabel.insufficientWalletBalance.replace(
        '{{tokenSymbol}}',
        PANCAKE_SWAP_TOKENS.busd.symbol,
      );

    await waitFor(() => getByText(expectedSubmitButtonLabel));
    expect(getByText(expectedSubmitButtonLabel).closest('button')).toBeDisabled();
  });

  it('disables submit button if amount entered in input would have a higher value than borrow balance after swapping', async () => {
    const customFakeFullRepaymentSwap: Swap = {
      ...fakeFullRepaymentSwap,
      expectedFromTokenAmountSoldWei: fakeBusdAmountBellowWalletBalanceWei,
      maximumFromTokenAmountSoldWei: fakeBusdAmountBellowWalletBalanceWei,
    };

    (useGetSwapInfo as jest.Mock).mockImplementation(
      ({ direction, toTokenAmountTokens }: UseGetSwapInfoInput) => ({
        swap:
          direction === 'exactAmountOut' &&
          toTokenAmountTokens &&
          new BigNumber(toTokenAmountTokens).isEqualTo(fakeAsset.userBorrowBalanceTokens)
            ? customFakeFullRepaymentSwap
            : fakeSwap,
        error: undefined,
        isLoading: false,
      }),
    );

    const { container, getByTestId, getByText } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter invalid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: FAKE_BUSD_BALANCE_TOKENS } });

    const expectedSubmitButtonLabel =
      en.borrowRepayModal.repay.submitButtonLabel.amountHigherThanRepayBalance;

    await waitFor(() => getByText(expectedSubmitButtonLabel));
    expect(getByText(expectedSubmitButtonLabel).closest('button')).toBeDisabled();
  });

  it('displays correct swap details', async () => {
    (useGetSwapInfo as jest.Mock).mockImplementation(
      ({ direction, toTokenAmountTokens }: UseGetSwapInfoInput) => ({
        swap:
          direction === 'exactAmountOut' &&
          toTokenAmountTokens &&
          new BigNumber(toTokenAmountTokens).isEqualTo(fakeAsset.userBorrowBalanceTokens)
            ? fakeFullRepaymentSwap
            : fakeSwap,
        error: undefined,
        isLoading: false,
      }),
    );

    const { container, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: FAKE_BUSD_BALANCE_TOKENS } });

    await waitFor(() => getByTestId(TEST_IDS.swapDetails));
    expect(getByTestId(TEST_IDS.swapDetails)).toMatchSnapshot();
  });

  it('updates input value to 0 when pressing on max button if wallet balance is 0', async () => {
    const customFakeTokenBalances: TokenBalance[] = fakeTokenBalances.map(tokenBalance => ({
      ...tokenBalance,
      balanceWei:
        tokenBalance.token.address.toLowerCase() === PANCAKE_SWAP_TOKENS.busd.address.toLowerCase()
          ? new BigNumber(0)
          : tokenBalance.balanceWei,
    }));

    (useGetSwapTokenUserBalances as jest.Mock).mockImplementation(() => ({
      data: customFakeTokenBalances,
    }));

    (useGetSwapInfo as jest.Mock).mockImplementation(
      ({ direction, toTokenAmountTokens }: UseGetSwapInfoInput) => ({
        swap:
          direction === 'exactAmountOut' &&
          toTokenAmountTokens &&
          new BigNumber(toTokenAmountTokens).isEqualTo(fakeAsset.userBorrowBalanceTokens)
            ? fakeFullRepaymentSwap
            : fakeSwap,
        error: undefined,
        isLoading: false,
      }),
    );

    const { container, getByText, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonLabel.enterValidAmount));

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    // Check input is empty
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;
    expect(selectTokenTextField.value).toBe('');

    // Click on max button
    fireEvent.click(getByText(en.borrowRepayModal.repay.rightMaxButtonLabel));

    // Check input value was updated correctly
    await waitFor(() => expect(selectTokenTextField.value).toBe('0'));

    // Check submit button is disabled
    expect(
      getByText(en.borrowRepayModal.repay.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();
  });

  it('updates input value to wallet balance when pressing on max button if wallet balance would be lower than borrow balance after swapping', async () => {
    const fakeBusdAmountAboveWalletBalanceWei = fakeBusdWalletBalanceWei.plus(100);

    const customFakeFullRepaymentSwap: Swap = {
      ...fakeFullRepaymentSwap,
      expectedFromTokenAmountSoldWei: fakeBusdAmountAboveWalletBalanceWei,
      maximumFromTokenAmountSoldWei: fakeBusdAmountAboveWalletBalanceWei,
    };

    (useGetSwapInfo as jest.Mock).mockImplementation(
      ({ direction, toTokenAmountTokens }: UseGetSwapInfoInput) => ({
        swap:
          direction === 'exactAmountOut' &&
          toTokenAmountTokens &&
          new BigNumber(toTokenAmountTokens).isEqualTo(fakeAsset.userBorrowBalanceTokens)
            ? customFakeFullRepaymentSwap
            : fakeSwap,
        error: undefined,
        isLoading: false,
      }),
    );

    const { container, getByText, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonLabel.enterValidAmount));

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    // Check input is empty
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;
    expect(selectTokenTextField.value).toBe('');

    // Click on max button
    fireEvent.click(getByText(en.borrowRepayModal.repay.rightMaxButtonLabel));

    // Check input value was updated correctly
    await waitFor(() => expect(selectTokenTextField.value).toBe(FAKE_BUSD_BALANCE_TOKENS));

    // Check submit button is enabled
    expect(
      getByText(en.borrowRepayModal.repay.submitButtonLabel.repay).closest('button'),
    ).toBeEnabled();
  });

  it('updates input value to converted borrow balance when pressing on max button if wallet balance is high enough to cover borrow balance after swapping', async () => {
    // Set a borrow balance in BUSD that's inferior to wallet balance so it be
    // covered it fully
    const fakeBorrowBalanceInBusdTokens = Number(FAKE_BUSD_BALANCE_TOKENS) - 1;
    const fakeBorrowBalanceInBusdWei = new BigNumber(fakeBorrowBalanceInBusdTokens).multipliedBy(
      new BigNumber(10).pow(PANCAKE_SWAP_TOKENS.busd.decimals),
    );

    const customFakeFullRepaymentSwap: Swap = {
      ...fakeFullRepaymentSwap,
      expectedFromTokenAmountSoldWei: fakeBorrowBalanceInBusdWei,
      maximumFromTokenAmountSoldWei: fakeBorrowBalanceInBusdWei,
    };

    (useGetSwapInfo as jest.Mock).mockImplementation(
      ({ direction, toTokenAmountTokens }: UseGetSwapInfoInput) => ({
        swap:
          direction === 'exactAmountOut' &&
          toTokenAmountTokens &&
          new BigNumber(toTokenAmountTokens).isEqualTo(fakeAsset.userBorrowBalanceTokens)
            ? customFakeFullRepaymentSwap
            : fakeSwap,
        error: undefined,
        isLoading: false,
      }),
    );

    const { container, getByText, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonLabel.enterValidAmount));

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    // Check input is empty
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;
    expect(selectTokenTextField.value).toBe('');

    // Click on max button
    fireEvent.click(getByText(en.borrowRepayModal.repay.rightMaxButtonLabel));

    // Check input value was updated correctly
    await waitFor(() =>
      expect(selectTokenTextField.value).toBe(`${fakeBorrowBalanceInBusdTokens}`),
    );

    // Check submit button is enabled
    expect(
      getByText(en.borrowRepayModal.repay.submitButtonLabel.repay).closest('button'),
    ).toBeEnabled();
  });

  it('updates input value to correct value when pressing on preset percentage buttons', async () => {
    const exchangeRate = new BigNumber(2);
    const getConvertedFromTokenAmountTokens = (toTokenAmountTokens: BigNumber | string) =>
      new BigNumber(toTokenAmountTokens).dividedBy(exchangeRate);

    // Generate fake swap info based on amount being swapped to
    const getFakeSwap = ({
      toTokenAmountTokens,
      direction,
      fromToken,
      toToken,
    }: UseGetSwapInfoInput) => {
      if (direction === 'exactAmountIn' || !toTokenAmountTokens) {
        return undefined;
      }

      const fakeConvertedFromTokenAmountTokens =
        getConvertedFromTokenAmountTokens(toTokenAmountTokens);
      const fakeConvertedFromTokenAmountWei = fakeConvertedFromTokenAmountTokens.multipliedBy(
        new BigNumber(10).pow(fromToken.decimals),
      );
      const fakeToTokenAmountReceivedWei = new BigNumber(toTokenAmountTokens).multipliedBy(
        new BigNumber(10).pow(toToken.decimals),
      );

      const customFakeSwap: Swap = {
        ...fakeFullRepaymentSwap,
        expectedFromTokenAmountSoldWei: fakeConvertedFromTokenAmountWei,
        maximumFromTokenAmountSoldWei: fakeConvertedFromTokenAmountWei,
        toTokenAmountReceivedWei: fakeToTokenAmountReceivedWei,
      };

      return customFakeSwap;
    };

    (useGetSwapInfo as jest.Mock).mockImplementation((input: UseGetSwapInfoInput) => ({
      swap: getFakeSwap(input),
      error: undefined,
      isLoading: false,
    }));

    const { container, getByText, getByTestId } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    await waitFor(() => getByText(en.borrowRepayModal.repay.submitButtonLabel.enterValidAmount));

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    // Check input is empty
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;
    expect(selectTokenTextField.value).toBe('');

    for (let i = 0; i < PRESET_PERCENTAGES.length; i++) {
      // Clear input
      fireEvent.change(selectTokenTextField, {
        target: { value: '' },
      });

      const presetPercentage = PRESET_PERCENTAGES[i];

      // Press on preset percentage button
      fireEvent.click(getByText(`${presetPercentage}%`));

      const fakeToTokenAmountRepaidTokens = fakeAsset.userBorrowBalanceTokens
        .multipliedBy(presetPercentage / 100)
        .dp(fakeAsset.vToken.underlyingToken.decimals);

      const fakeConvertedFromTokenAmountTokens = getConvertedFromTokenAmountTokens(
        fakeToTokenAmountRepaidTokens,
      ).dp(PANCAKE_SWAP_TOKENS.busd.decimals);

      expect(selectTokenTextField.value).toBe(fakeConvertedFromTokenAmountTokens.toFixed());
    }
  });

  it('lets user swap and repay partial loan, then displays successful transaction modal and calls onClose callback on success', async () => {
    (useGetSwapInfo as jest.Mock).mockImplementation(
      ({ direction, toTokenAmountTokens }: UseGetSwapInfoInput) => ({
        swap:
          direction === 'exactAmountOut' &&
          toTokenAmountTokens &&
          new BigNumber(toTokenAmountTokens).isEqualTo(fakeAsset.userBorrowBalanceTokens)
            ? fakeFullRepaymentSwap
            : fakeSwap,
        error: undefined,
        isLoading: false,
      }),
    );

    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    const { container, getByTestId, getByText } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={onCloseMock} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    const validAmountTokens = FAKE_BUSD_BALANCE_TOKENS;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: validAmountTokens } });

    const expectedSubmitButtonLabel = en.borrowRepayModal.repay.submitButtonLabel.repay;

    // Click on submit button
    await waitFor(() => getByText(expectedSubmitButtonLabel));
    fireEvent.click(getByText(expectedSubmitButtonLabel));

    // TODO: check onSwapAndRepay is called once with the correct arguments (see VEN-1270)
    // const expectedAmountSwappedWei = new BigNumber(validAmountTokens).multipliedBy(
    //   new BigNumber(10).pow(PANCAKE_SWAP_TOKENS.busd.decimals),
    // );

    const expectedAmountRepaidWei = fakeSwap.expectedToTokenAmountReceivedWei;

    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));

    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: fakeAsset.vToken.underlyingToken,
        valueWei: expectedAmountRepaidWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });

  it('lets user swap and repay full loan', async () => {
    (useGetSwapInfo as jest.Mock).mockImplementation(
      ({ direction, toTokenAmountTokens }: UseGetSwapInfoInput) => ({
        swap:
          direction === 'exactAmountOut' &&
          toTokenAmountTokens &&
          new BigNumber(toTokenAmountTokens).isEqualTo(fakeAsset.userBorrowBalanceTokens)
            ? fakeFullRepaymentSwap
            : fakeSwap,
        error: undefined,
        isLoading: false,
      }),
    );

    const onCloseMock = jest.fn();
    const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();

    const { container, getByTestId, getByText } = renderComponent(
      <Repay asset={fakeAsset} pool={fakePool} onCloseModal={onCloseMock} />,
      {
        authContextValue: {
          accountAddress: fakeAccountAddress,
        },
      },
    );

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: PANCAKE_SWAP_TOKENS.busd,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Click on max button
    fireEvent.click(getByText(en.borrowRepayModal.repay.rightMaxButtonLabel));

    await waitFor(() => expect(selectTokenTextField.value).toBe(FAKE_BUSD_BALANCE_TOKENS));

    // Check notice is displayed
    await waitFor(() =>
      expect(getByText(en.borrowRepayModal.repay.fullRepaymentWarning)).toBeTruthy(),
    );

    const expectedSubmitButtonLabel = en.borrowRepayModal.repay.submitButtonLabel.repay;

    // Click on submit button
    await waitFor(() => getByText(expectedSubmitButtonLabel));
    fireEvent.click(getByText(expectedSubmitButtonLabel));

    // TODO: check onSwapAndRepay is called once with the correct arguments (see VEN-1270)
    // const expectedAmountSwappedWei = new BigNumber(validAmountTokens).multipliedBy(
    //   new BigNumber(10).pow(PANCAKE_SWAP_TOKENS.busd.decimals),
    // );

    const expectedAmountRepaidWei = fakeFullRepaymentSwap.toTokenAmountReceivedWei;

    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));

    expect(openSuccessfulTransactionModal).toHaveBeenCalledWith({
      transactionHash: fakeContractReceipt.transactionHash,
      amount: {
        token: fakeAsset.vToken.underlyingToken,
        valueWei: expectedAmountRepaidWei,
      },
      content: expect.any(String),
      title: expect.any(String),
    });
  });
});
