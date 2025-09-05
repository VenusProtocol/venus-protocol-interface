import { act, fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { getVTokenBalance, useGetVTokenBalance, useWithdraw } from 'clients/api';
import { en } from 'libs/translations';
import { type Asset, ChainId, type Pool } from 'types';

import { chainMetadata } from '@venusprotocol/chains';
import Withdraw from '..';
import { fakeAsset, fakePool, fakeVTokenBalanceMantissa } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

const testCases = [
  [
    'user borrow limit',
    {
      asset: fakeAsset,
      pool: fakePool,
    },
  ],
  [
    'user supply balance',
    {
      asset: {
        ...fakeAsset,
        userSupplyBalanceTokens: new BigNumber(1),
      },
      pool: fakePool,
    },
  ],
  [
    'user health factor',
    {
      asset: fakeAsset,
      pool: {
        ...fakePool,
        userLiquidationThresholdCents: new BigNumber(105),
        userBorrowLimitCents: new BigNumber(100),
        userBorrowBalanceCents: new BigNumber(99),
      },
    },
  ],
  [
    'asset liquidity',
    {
      asset: {
        ...fakeAsset,
        liquidityCents: new BigNumber(50),
      },
      pool: fakePool,
    },
  ],
] as const;

describe('WithdrawForm', () => {
  it('prompts user to connect their wallet if they are not connected', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Withdraw onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
    );

    // Check "Connect wallet" button is displayed
    expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.valueInput).closest('input')).toBeDisabled();
  });

  it.each(testCases)(
    'renders correct available amount when %s is the limiting factor',
    async (_, { asset, pool }) => {
      const { getByTestId } = renderComponent(
        <Withdraw asset={asset} pool={pool} onSubmitSuccess={noop} />,
        {
          accountAddress: fakeAccountAddress,
        },
      );

      expect(getByTestId(TEST_IDS.availableAmount).textContent).toMatchSnapshot();
    },
  );

  it.each(testCases)(
    'updates input value correctly when clicking on max button when asset is a collateral and %s is the limiting factor',
    async (_, { asset, pool }) => {
      const { getByText, getByTestId } = renderComponent(
        <Withdraw asset={asset} pool={pool} onSubmitSuccess={noop} />,
        {
          accountAddress: fakeAccountAddress,
        },
      );

      // Check input is empty
      const input = getByTestId(TEST_IDS.valueInput) as HTMLInputElement;
      expect(input.value).toBe('');

      // Press on max button
      act(() => {
        fireEvent.click(getByText(en.operationForm.safeMaxButtonLabel));
      });

      await waitFor(() => expect(input.value).toMatchSnapshot());
    },
  );

  it('updates input value correctly when clicking on max button when asset is not a collateral', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      isCollateralOfUser: false,
    };

    const { getByText, getByTestId } = renderComponent(
      <Withdraw asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check input is empty
    const input = getByTestId(TEST_IDS.valueInput) as HTMLInputElement;
    expect(input.value).toBe('');

    // Press on max button
    act(() => {
      fireEvent.click(getByText(en.operationForm.safeMaxButtonLabel));
    });

    await waitFor(() => expect(input.value).toMatchInlineSnapshot(`"1000"`));

    // Check submit button is enabled
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitButton).toBeEnabled();
  });

  it('submit button is disabled with no amount', async () => {
    renderComponent(<Withdraw onSubmitSuccess={noop} asset={fakeAsset} pool={fakePool} />, {
      accountAddress: fakeAccountAddress,
    });

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
    );
    expect(submitButton).toBeDisabled();
  });

  it('submit button is disabled when entering a value higher than the available liquidity', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      userBorrowBalanceCents: new BigNumber(0),
      userBorrowLimitCents: new BigNumber(10000000000),
    };

    const customFakeAsset: Asset = {
      ...fakeAsset,
      tokenPriceCents: new BigNumber(1),
      liquidityCents: new BigNumber(60),
      userSupplyBalanceTokens: new BigNumber(100),
    };

    const { getByTestId, getByText } = renderComponent(
      <Withdraw onSubmitSuccess={noop} asset={customFakeAsset} pool={customFakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectAmountTokens = 90;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: incorrectAmountTokens } });
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanAvailableLiquidity)).toBeInTheDocument(),
    );

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
    );
    expect(submitButton).toBeDisabled();
  });

  it('submit button is disabled when entering a value higher than the withdrawable amount', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      userBorrowBalanceCents: new BigNumber(0),
      userBorrowLimitCents: new BigNumber(10000000000),
    };

    const customFakeAsset: Asset = {
      ...fakeAsset,
      tokenPriceCents: new BigNumber(1),
      liquidityCents: new BigNumber(60000),
      userSupplyBalanceTokens: new BigNumber(100),
    };

    const { getByTestId, getByText } = renderComponent(
      <Withdraw onSubmitSuccess={noop} asset={customFakeAsset} pool={customFakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectAmountTokens = 110;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: incorrectAmountTokens } });
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanAvailableAmount)).toBeInTheDocument(),
    );

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
    );
    expect(submitButton).toBeDisabled();
  });

  it('submit button is disabled when entering a value that would liquidate the user', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      userBorrowBalanceCents: new BigNumber(10000),
      userBorrowLimitCents: new BigNumber(100000),
      userLiquidationThresholdCents: new BigNumber(110000),
    };

    const customFakeAsset: Asset = {
      ...fakeAsset,
      tokenPriceCents: new BigNumber(1),
      userSupplyBalanceTokens: new BigNumber(100000),
      userCollateralFactor: 1,
    };

    const { getByTestId, getByText } = renderComponent(
      <Withdraw onSubmitSuccess={noop} asset={customFakeAsset} pool={customFakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const deltaTokens = customFakePool
      .userLiquidationThresholdCents!.minus(customFakePool.userBorrowBalanceCents!)
      // Add one token above limit
      .plus(1);

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, {
        target: { value: deltaTokens.toNumber() },
      });
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanAvailableAmount)).toBeInTheDocument(),
    );

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
    );
    expect(submitButton).toBeDisabled();
  });

  it('prompts user to switch chain if they are connected to the wrong one', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Withdraw onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
        accountChainId: ChainId.ARBITRUM_ONE,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const correctAmountTokens = 1;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

    // Check "Switch chain" button is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.switchChain.switchButton.replace(
            '{{chainName}}',
            chainMetadata[ChainId.BSC_TESTNET].name,
          ),
        ),
      ).toBeInTheDocument(),
    );
  });

  it('prompts user to acknowledge risk if requested withdrawal lowers health factor to risky threshold', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      userBorrowBalanceCents: new BigNumber(500),
      userBorrowLimitCents: new BigNumber(1000),
      userSupplyBalanceCents: new BigNumber(1000),
      userLiquidationThresholdCents: new BigNumber(1100),
    };

    const customFakeAsset: Asset = {
      ...fakeAsset,
      liquidityCents: new BigNumber(1000000000000),
      userCollateralFactor: 1,
      liquidationThresholdPercentage: 110,
      tokenPriceCents: new BigNumber(1),
      supplyBalanceTokens: new BigNumber(1000),
    };

    const { getByText, getByTestId, getByRole } = renderComponent(
      <Withdraw asset={customFakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const inputValue = customFakePool
      .userBorrowLimitCents!.minus(customFakePool.userBorrowBalanceCents!)
      .dividedBy(customFakeAsset.userCollateralFactor)
      .dividedBy(customFakeAsset.tokenPriceCents)
      .toFixed(customFakeAsset.vToken.underlyingToken.decimals);

    // Enter amount in input
    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.valueInput) as HTMLInputElement,
    );
    fireEvent.change(tokenTextInput, {
      target: { value: inputValue },
    });

    await waitFor(() => expect(tokenTextInput.value).toBe(inputValue));

    // Check warning is displayed
    expect(getByText(en.operationForm.riskyOperation.warning));

    // Check submit button is disabled
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.withdraw),
    );
    expect(submitButton).toBeDisabled();

    // Toggle acknowledgement
    const toggle = getByRole('checkbox');
    act(() => {
      fireEvent.click(toggle);
    });

    await waitFor(() => expect(document.querySelector('button[type="submit"]')).toBeEnabled());
  });

  it('let user withdraw full supply succeeds', async () => {
    const mockWithdraw = vi.fn();
    (useWithdraw as Mock).mockImplementation(() => ({
      mutateAsync: mockWithdraw,
    }));

    (useGetVTokenBalance as Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeVTokenBalanceMantissa,
      },
    }));

    const customFakeAsset: Asset = {
      ...fakeAsset,
      isCollateralOfUser: false,
    };

    (getVTokenBalance as Mock).mockImplementation(() => ({
      balanceMantissa: fakeVTokenBalanceMantissa,
    }));

    const { getByText } = renderComponent(
      <Withdraw onSubmitSuccess={noop} asset={customFakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    fireEvent.click(getByText(en.operationForm.safeMaxButtonLabel));

    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

    await waitFor(() => expect(submitButton).toBeEnabled());

    act(() => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => expect(mockWithdraw).toHaveBeenCalledTimes(1));
    expect(mockWithdraw.mock.calls[0]).toMatchSnapshot();
  });

  it('lets user withdraw partial supply succeeds', async () => {
    const mockWithdraw = vi.fn();
    (useWithdraw as Mock).mockImplementation(() => ({
      mutateAsync: mockWithdraw,
    }));

    const { getByTestId } = renderComponent(
      <Withdraw onSubmitSuccess={noop} asset={fakeAsset} pool={fakePool} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const correctAmountTokens = 1;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.valueInput));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });
    });
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.withdraw);
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockWithdraw).toHaveBeenCalledTimes(1));
    expect(mockWithdraw.mock.calls[0]).toMatchSnapshot();
  });
});
