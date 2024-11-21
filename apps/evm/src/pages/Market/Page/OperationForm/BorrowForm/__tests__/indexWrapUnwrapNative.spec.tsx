import { fireEvent, waitFor } from '@testing-library/react';
import fakeAccountAddress from '__mocks__/models/address';
import noop from 'noop-ts';
import { renderComponent } from 'testUtils/render';
import type Vi from 'vitest';

import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { ChainId } from 'types';

import BigNumber from 'bignumber.js';
import { borrow } from 'clients/api';
import { en } from 'libs/translations';
import Borrow from '..';
import { fakeAsset, fakePool, fakeWethAsset } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('libs/tokens');
vi.mock('hooks/useGetNativeWrappedTokenUserBalances');

describe('BorrowForm - Feature flag enabled: wrapUnwrapNativeToken', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'wrapUnwrapNativeToken',
    );
  });

  it('renders without crashing', () => {
    renderComponent(<Borrow asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />, {
      chainId: ChainId.SEPOLIA,
    });
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const { getByText, getByTestId } = renderComponent(
      <Borrow onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
    );

    // Check "Connect wallet" button is displayed
    expect(getByText(en.operationForm.connectWalletButtonLabel)).toBeInTheDocument();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField)).toBeDisabled();
  });

  it('does not display the receive native token toggle if the underlying token does not wrap the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Borrow asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.receiveNativeToken)).toBeNull();
  });

  it('displays the receive native token toggle if the underlying token wraps the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Borrow asset={fakeWethAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.receiveNativeToken)).toBeVisible();
  });

  it('lets the user borrow and unwrap tokens', async () => {
    const onCloseMock = vi.fn();
    const { getByTestId } = renderComponent(
      <Borrow asset={fakeWethAsset} pool={fakePool} onSubmitSuccess={onCloseMock} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    // receive native token is active by default, so no need to click on it

    // Enter amount in input
    const correctAmountTokens = 1;
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
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
      unwrap: true,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
