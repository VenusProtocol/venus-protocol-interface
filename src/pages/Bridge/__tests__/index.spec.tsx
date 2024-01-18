import { fireEvent, waitFor } from '@testing-library/dom';
import Vi from 'vitest';

import { renderComponent } from 'testUtils/render';

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
});
