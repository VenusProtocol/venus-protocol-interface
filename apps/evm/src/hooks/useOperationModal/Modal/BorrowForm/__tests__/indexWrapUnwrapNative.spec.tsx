import { fireEvent, waitFor } from '@testing-library/react';
import fakeAccountAddress from '__mocks__/models/address';
import noop from 'noop-ts';
import { renderComponent } from 'testUtils/render';
import type Vi from 'vitest';

import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { ChainId } from 'types';

import BigNumber from 'bignumber.js';
import { borrowAndUnwrap } from 'clients/api';
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
    renderComponent(<Borrow asset={fakeAsset} pool={fakePool} onCloseModal={noop} />, {
      chainId: ChainId.SEPOLIA,
    });
  });

  it('does not display the receive native token toggle if the underlying token does not wrap the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Borrow asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.receiveNativeToken)).toBeNull();
  });

  it('displays the receive native token toggle if the underlying token wraps the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Borrow asset={fakeWethAsset} pool={fakePool} onCloseModal={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.receiveNativeToken)).toBeVisible();
  });

  it('lets the user borrow native tokens by unwrapping', async () => {
    const onCloseMock = vi.fn();
    const { getByText, getByTestId, getByRole } = renderComponent(
      <Borrow asset={fakeWethAsset} pool={fakePool} onCloseModal={onCloseMock} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    // click on receive native token
    const receiveNativeTokenSwitch = getByRole('checkbox');
    fireEvent.click(receiveNativeTokenSwitch);

    // Enter amount in input
    const correctAmountTokens = 1;
    fireEvent.change(getByTestId(TEST_IDS.tokenTextField), {
      target: { value: correctAmountTokens },
    });

    // Click on submit button
    await waitFor(() => getByText(en.operationModal.borrow.submitButtonLabel.borrow));
    fireEvent.click(getByText(en.operationModal.borrow.submitButtonLabel.borrow));

    const expectedAmountMantissa = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() => expect(borrowAndUnwrap).toHaveBeenCalledTimes(1));
    expect(borrowAndUnwrap).toHaveBeenCalledWith({
      amountMantissa: expectedAmountMantissa,
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
