import { fireEvent, waitFor } from '@testing-library/react';
import fakeAccountAddress from '__mocks__/models/address';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import { renderComponent } from 'testUtils/render';
import type { Mock } from 'vitest';

import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import { type BalanceMutation, ChainId } from 'types';

import { useBorrow } from 'clients/api';
import { en } from 'libs/translations';
import Borrow from '..';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import { fakeWethAsset } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

describe('BorrowForm - Feature flag enabled: wrapUnwrapNativeToken', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'wrapUnwrapNativeToken',
    );
  });

  it('renders without crashing', () => {
    renderComponent(<Borrow asset={fakeAsset} pool={fakePool} onSubmitSuccess={noop} />, {
      chainId: ChainId.SEPOLIA,
    });
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
    const mockBorrow = vi.fn();
    (useBorrow as Mock).mockImplementation(() => ({
      mutateAsync: mockBorrow,
      isPending: false,
    }));

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
    const correctAmountTokens = 1n;
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: correctAmountTokens },
    });

    const expectedBalanceMutations: BalanceMutation[] = [
      {
        type: 'asset',
        action: 'borrow',
        vTokenAddress: fakeWethAsset.vToken.address,
        amountTokens: new BigNumber(correctAmountTokens.toString()),
      },
    ];

    expect(useSimulateBalanceMutations).toHaveBeenCalledWith({
      pool: fakePool,
      balanceMutations: expectedBalanceMutations,
    });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.borrow),
    );
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    const expectedAmountMantissa =
      correctAmountTokens * 10n ** BigInt(fakeAsset.vToken.underlyingToken.decimals);

    await waitFor(() => expect(mockBorrow).toHaveBeenCalledTimes(1));
    expect(mockBorrow).toHaveBeenCalledWith({
      amountMantissa: expectedAmountMantissa,
      unwrap: true,
      poolName: fakePool.name,
      poolComptrollerAddress: fakePool.comptrollerAddress,
      vToken: fakeWethAsset.vToken,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
