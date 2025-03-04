import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { renderComponent } from 'testUtils/render';

import { borrow } from 'clients/api';
import { SAFE_BORROW_LIMIT_PERCENTAGE } from 'constants/safeBorrowLimitPercentage';
import { en } from 'libs/translations';
import { type Asset, ChainId, type Pool } from 'types';

import { chainMetadata } from '@venusprotocol/chains';
import BorrowForm from '..';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

const checkSubmitButtonIsDisabled = async () => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  await waitFor(() =>
    expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
  );
  expect(submitButton).toBeDisabled();
};

describe('BorrowForm', () => {
  it('renders without crashing', () => {
    renderComponent(<BorrowForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />);
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BorrowForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
    );

    // Check "Connect wallet" button is displayed
    expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();
  });

  it('renders correct token borrowable amount when asset liquidity is higher than maximum amount of tokens user can borrow before reaching their borrow limit', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      liquidityCents: new BigNumber(100000000),
    };

    const { getByText } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText('990 XVS'));
  });

  it('renders correct token borrowable amount when asset liquidity is lower than maximum amount of tokens user can borrow before reaching their borrow limit', async () => {
    const customFakeAsset = {
      ...fakeAsset,
      liquidityCents: new BigNumber(50),
    };

    const { getByText } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText('0.5 XVS'));
  });

  it('disables form and displays a warning notice if the borrow cap of this market has been reached', async () => {
    const customFakeAsset = {
      ...fakeAsset,
      borrowCapTokens: new BigNumber(100),
      borrowBalanceTokens: new BigNumber(100),
    };

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check warning is displayed
    await waitFor(() =>
      expect(
        getByText(en.operationForm.error.borrowCapReached.replace('{{assetBorrowCap}}', '100 XVS')),
      ).toBeInTheDocument(),
    );

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();

    await checkSubmitButtonIsDisabled();
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

    const { getByText } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={customFakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check warning is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.operationForm.error.noCollateral.replace(
            '{{tokenSymbol}}',
            fakeAsset.vToken.underlyingToken.symbol,
          ),
        ),
      ).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button and displays a warning notice if an amount entered is higher than asset liquidity', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      liquidityCents: new BigNumber(200),
    };

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectValueTokens = new BigNumber(customFakeAsset.liquidityCents)
      .dividedBy(customFakeAsset.tokenPriceCents)
      // Add one token more than the available liquidity
      .plus(1)
      .dp(customFakeAsset.vToken.underlyingToken.decimals, BigNumber.ROUND_DOWN)
      .toFixed();

    // Enter amount in input
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
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

  it('disables submit button and displays a warning notice if an amount entered is higher than asset borrow cap', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      borrowCapTokens: new BigNumber(100),
      borrowBalanceTokens: new BigNumber(10),
    };

    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectValueTokens = new BigNumber(customFakeAsset.borrowCapTokens!)
      .minus(customFakeAsset.borrowBalanceTokens)
      // Add one token too much
      .plus(1)
      .toFixed();

    // Enter amount in input
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.operationForm.error.higherThanBorrowCap
            .replace('{{userMaxBorrowAmount}}', '90 XVS')
            .replace('{{assetBorrowCap}}', '100 XVS')
            .replace('{{assetBorrowBalance}}', '10 XVS'),
        ),
      ).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if amount to borrow requested would make user borrow balance go higher than their borrow limit', async () => {
    const { getByTestId, getByText } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

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
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check warning is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanBorrowableAmount)).toBeInTheDocument(),
    );

    await checkSubmitButtonIsDisabled();
  });

  it('prompts user to switch chain if they are connected to the wrong one', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BorrowForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
        accountChainId: ChainId.ARBITRUM_ONE,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const correctAmountTokens = 1;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
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

  it('displays warning notice if amount to borrow requested would bring user borrow balance at safe borrow limit', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

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
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, {
      target: { value: riskyValueTokens },
    });

    // Check notice is displayed
    expect(getByText(en.operationForm.warning.aboveSafeLimit).textContent).toMatchInlineSnapshot(
      '"You entered a high value. There is a risk of liquidation."',
    );

    // Check submit button is enabled
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.borrow),
    );
    expect(submitButton).toBeEnabled();
  });

  it('updates input value correctly when pressing on max button', async () => {
    const { getByText, getByTestId } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

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
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.borrow),
    );
    expect(submitButton).toBeEnabled();
  });

  it('lets user borrow tokens then calls onClose callback on success', async () => {
    const onCloseMock = vi.fn();

    (borrow as Mock).mockImplementationOnce(async () => fakeContractTransaction);

    const { getByTestId } = renderComponent(
      <BorrowForm asset={fakeAsset} pool={fakePool} onSubmitSuccess={onCloseMock} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Enter amount in input
    const correctAmountTokens = 1;
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, {
      target: { value: correctAmountTokens },
    });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.borrow),
    );
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    const expectedAmountMantissa = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(borrow).toHaveBeenCalledTimes(1));
    expect(borrow).toHaveBeenCalledWith({
      amountMantissa: expectedAmountMantissa,
      unwrap: false,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
