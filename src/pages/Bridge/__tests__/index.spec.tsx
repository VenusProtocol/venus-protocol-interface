import { fireEvent, waitFor } from '@testing-library/dom';
import BigNumber from 'bignumber.js';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import { bridgeXvs, useGetBalanceOf, useGetXvsBridgeFeeEstimation } from 'clients/api';
import { en } from 'packages/translations';
import { useAuthModal, useSwitchChain } from 'packages/wallet';
import { ChainId } from 'types';

import Bridge from '..';
import TEST_IDS from '../testIds';

describe('Bridge', () => {
  it('renders without crashing', () => {
    renderComponent(<Bridge />);
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const openAuthModalMock = vi.fn();
    (useAuthModal as Vi.Mock).mockImplementation(() => ({
      isAuthModalOpen: false,
      openAuthModal: openAuthModalMock,
    }));

    const { getByText } = renderComponent(<Bridge />);

    // Check connect button is present
    await waitFor(() => getByText(en.bridgePage.connectWalletButton.label));

    // Click on connect button
    fireEvent.click(getByText(en.bridgePage.connectWalletButton.label).closest('button')!);

    await waitFor(() => expect(openAuthModalMock).toHaveBeenCalledTimes(1));
  });

  it('handles changing from chain ID correctly', async () => {
    const switchChainMock = vi.fn(({ callback }: { callback: () => void }) => callback());

    (useSwitchChain as Vi.Mock).mockImplementation(() => ({
      switchChain: switchChainMock,
    }));

    const { getByTestId } = renderComponent(<Bridge />, {
      chainId: ChainId.BSC_TESTNET,
    });

    await waitFor(() =>
      expect((getByTestId(TEST_IDS.fromChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.BSC_TESTNET),
      ),
    );
    expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
      String(ChainId.OPBNB_TESTNET),
    );

    // Change from chain ID
    fireEvent.change(getByTestId(TEST_IDS.fromChainIdSelect), {
      target: { value: ChainId.SEPOLIA },
    });

    await waitFor(() => expect(switchChainMock).toHaveBeenCalledTimes(1));
    expect(switchChainMock).toHaveBeenCalledWith({
      chainId: ChainId.SEPOLIA,
      callback: expect.any(Function),
    });

    await waitFor(() =>
      expect((getByTestId(TEST_IDS.fromChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.SEPOLIA),
      ),
    );
  });

  it('handles changing to chain ID correctly', async () => {
    const switchChainMock = vi.fn(({ callback }: { callback: () => void }) => callback());

    (useSwitchChain as Vi.Mock).mockImplementation(() => ({
      switchChain: switchChainMock,
    }));

    const { getByTestId } = renderComponent(<Bridge />, {
      chainId: ChainId.BSC_TESTNET,
    });

    await waitFor(() =>
      expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.OPBNB_TESTNET),
      ),
    );

    // Change from chain ID
    fireEvent.change(getByTestId(TEST_IDS.toChainIdSelect), {
      target: { value: ChainId.BSC_TESTNET },
    });

    await waitFor(() =>
      expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.BSC_TESTNET),
      ),
    );
  });

  it('handles chain switch correctly', async () => {
    const switchChainMock = vi.fn(({ callback }: { callback: () => void }) => callback());

    (useSwitchChain as Vi.Mock).mockImplementation(() => ({
      switchChain: switchChainMock,
    }));

    const { getByTestId } = renderComponent(<Bridge />, {
      chainId: ChainId.BSC_TESTNET,
    });

    await waitFor(() =>
      expect((getByTestId(TEST_IDS.fromChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.BSC_TESTNET),
      ),
    );
    expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
      String(ChainId.OPBNB_TESTNET),
    );

    // Click on switch button
    fireEvent.click(getByTestId(TEST_IDS.switchChainsButton));

    await waitFor(() => expect(switchChainMock).toHaveBeenCalledTimes(1));
    expect(switchChainMock).toHaveBeenCalledWith({
      chainId: ChainId.OPBNB_TESTNET,
      callback: expect.any(Function),
    });

    await waitFor(() =>
      expect((getByTestId(TEST_IDS.fromChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.OPBNB_TESTNET),
      ),
    );
    expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
      String(ChainId.BSC_TESTNET),
    );
  });

  it('updates input value correctly when clicking on max button', async () => {
    const fakeBalanceMantissa = new BigNumber('10000000000000000000');
    (useGetBalanceOf as Vi.Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeBalanceMantissa,
      },
    }));
    const { getByText, getByTestId } = renderComponent(<Bridge />, {
      chainId: ChainId.BSC_TESTNET,
    });

    // Click on max button
    fireEvent.click(getByText(en.bridgePage.amountInput.maxButtonLabel));

    // Check input value was updated correctly
    await waitFor(() =>
      expect((getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement).value).toEqual('10'),
    );
  });

  it('lets the user the bridge XVS', async () => {
    const fakeBalanceMantissa = new BigNumber('10000000000000000000');
    const fakeBridgeFeeMantissa = new BigNumber('50000000000000000');
    (useGetXvsBridgeFeeEstimation as Vi.Mock).mockImplementation(() => ({
      data: {
        estimationFeeMantissa: fakeBridgeFeeMantissa,
      },
    }));
    (useGetBalanceOf as Vi.Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeBalanceMantissa,
      },
    }));
    const fakeBridgeXvsParams = {
      accountAddress: fakeAccountAddress,
      amountMantissa: fakeBalanceMantissa,
      destinationChainId: ChainId.SEPOLIA,
      nativeCurrencyFeeMantissa: fakeBridgeFeeMantissa,
    };

    const { getByText, getByTestId } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      chainId: ChainId.BSC_TESTNET,
    });

    // Click on max button
    fireEvent.click(getByText(en.bridgePage.amountInput.maxButtonLabel));

    // Check input value was updated correctly
    await waitFor(() =>
      expect((getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement).value).toEqual('10'),
    );

    // Submit bridge request
    const submitButton = await waitFor(
      () =>
        getByText(en.bridgePage.submitButton.label.submit).closest('button') as HTMLButtonElement,
    );
    fireEvent.click(submitButton);

    await waitFor(() => expect(bridgeXvs).toHaveBeenCalledTimes(1));
    expect(bridgeXvs).toHaveBeenCalledWith(fakeBridgeXvsParams);
  });
});
