import { fireEvent, waitFor } from '@testing-library/dom';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { renderComponent } from 'testUtils/render';

import {
  useBridgeXvs,
  useGetBalanceOf,
  useGetXvsBridgeDestinationLimits,
  useGetXvsBridgeFeeEstimation,
  useGetXvsBridgeMintStatus,
  useGetXvsBridgeStatus,
} from 'clients/api';
import { en } from 'libs/translations';
import { useAuthModal, useChainId, useSwitchChain } from 'libs/wallet';
import { ChainId } from 'types';

import { chains } from '@venusprotocol/chains';
import config from 'config';
import { fromUnixTime } from 'date-fns';
import Bridge from '..';
import TEST_IDS from '../testIds';

vi.mock('hooks/useIsFeatureEnabled', async () => {
  const actual = await vi.importActual<typeof import('hooks/useIsFeatureEnabled')>(
    'hooks/useIsFeatureEnabled',
  );

  return actual;
});

const fakeDailyLimitResetTimestamp = new BigNumber('1705060800');
const fakeMaxDailyLimitUsd = new BigNumber('100000000000000000000');
// tests will run inside the 24 hour daily transaction window
const fakeNowDate = fromUnixTime(fakeDailyLimitResetTimestamp.toNumber());
fakeNowDate.setMinutes(fakeNowDate.getMinutes() + 5);

const fakeBalanceMantissa = new BigNumber('10000000000000000000');
const fakeBridgeFeeMantissa = new BigNumber('50000000000000000');
const fakeBridgeStatusData = {
  dailyLimitResetTimestamp: fakeDailyLimitResetTimestamp,
  maxDailyLimitUsd: fakeMaxDailyLimitUsd,
  totalTransferredLast24HourUsd: new BigNumber('0'),
  maxSingleTransactionLimitUsd: new BigNumber('100000000000000000000'),
};

const fakeOpenLaneLimitMantissa = new BigNumber('20000000000000000000000');

// marks every lane other than the passed ones as closed on-chain (single transaction limit of 0)
const mockOpenBridgeLanes = (openChainIds: ChainId[]) =>
  (useGetXvsBridgeDestinationLimits as Mock).mockImplementation(
    ({ toChainIds }: { toChainIds: ChainId[] }) => ({
      data: {
        maxSingleTransactionLimitMantissas: toChainIds.reduce(
          (acc, toChainId) => ({
            ...acc,
            [toChainId]: openChainIds.includes(toChainId)
              ? fakeOpenLaneLimitMantissa
              : new BigNumber(0),
          }),
          {},
        ),
      },
    }),
  );

const closedTestnetLaneChainIds = [
  ChainId.SEPOLIA,
  ChainId.ARBITRUM_SEPOLIA,
  ChainId.ZKSYNC_SEPOLIA,
  ChainId.OPTIMISM_SEPOLIA,
  ChainId.BASE_SEPOLIA,
  ChainId.UNICHAIN_SEPOLIA,
];

const switchChainMock = vi.fn(
  ({ chainId, callback }: { chainId: ChainId; callback: () => void }) => {
    // simulate that calling swtichChain makes useChainId return an updated chainId
    (useChainId as Mock).mockImplementation(() => ({
      chainId,
    }));
    callback();
  },
);

describe('Bridge', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(fakeNowDate);

    (useSwitchChain as Mock).mockImplementation(() => ({
      switchChain: switchChainMock,
    }));
    (useGetBalanceOf as Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeBalanceMantissa,
      },
      isLoading: false,
    }));
    (useGetXvsBridgeFeeEstimation as Mock).mockImplementation(() => ({
      data: {
        estimationFeeMantissa: fakeBridgeFeeMantissa,
      },
    }));
    (useGetXvsBridgeStatus as Mock).mockImplementation(() => ({
      data: fakeBridgeStatusData,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Bridge />);
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const openAuthModalMock = vi.fn();
    (useAuthModal as Mock).mockImplementation(() => ({
      isAuthModalOpen: false,
      openAuthModal: openAuthModalMock,
    }));

    const { getByText } = renderComponent(<Bridge />);

    // Check connect button is present
    await waitFor(() => getByText(en.connectButton.connect));

    // Click on connect button
    fireEvent.click(getByText(en.connectButton.connect).closest('button')!);

    await waitFor(() => expect(openAuthModalMock).toHaveBeenCalledTimes(1));
  });

  it('prompts user to switch chain if they are connected to the wrong one', async () => {
    const { getByText, getByTestId } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      accountChainId: ChainId.ARBITRUM_ONE,
      chainId: ChainId.BSC_TESTNET,
    });

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, { target: { value: 1 } });

    // Check "Switch chain" button is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.switchChain.switchButton.replace('{{chainName}}', chains[ChainId.BSC_TESTNET].name),
        ),
      ).toBeInTheDocument(),
    );
  });

  it('handles changing from chain ID correctly', async () => {
    const { getByTestId } = renderComponent(<Bridge />, {
      chainId: ChainId.SEPOLIA,
    });

    await waitFor(() =>
      expect((getByTestId(TEST_IDS.fromChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.SEPOLIA),
      ),
    );
    expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
      String(ChainId.BSC_TESTNET),
    );

    // Change from chain ID
    fireEvent.change(getByTestId(TEST_IDS.fromChainIdSelect), {
      target: { value: ChainId.OPBNB_TESTNET },
    });

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
  });

  it('handles changing to chain ID correctly', async () => {
    const { getByTestId } = renderComponent(<Bridge />, {
      chainId: ChainId.BSC_TESTNET,
    });

    await waitFor(() =>
      expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.SEPOLIA),
      ),
    );

    // Change from chain ID
    fireEvent.change(getByTestId(TEST_IDS.toChainIdSelect), {
      target: { value: ChainId.SEPOLIA },
    });

    await waitFor(() =>
      expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.SEPOLIA),
      ),
    );
  });

  it('handles chain switch correctly', async () => {
    (useSwitchChain as Mock).mockImplementation(() => ({
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
      String(ChainId.SEPOLIA),
    );

    // Click on switch button
    fireEvent.click(getByTestId(TEST_IDS.switchChainsButton));

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
    expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
      String(ChainId.BSC_TESTNET),
    );
  });

  it('updates input value correctly when clicking on max button', async () => {
    const { getByText, getByTestId } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      chainId: ChainId.BSC_TESTNET,
    });

    // Click on max button
    const maxButton = await waitFor(
      () => getByText(en.bridgePage.amountInput.maxButtonLabel) as HTMLButtonElement,
    );
    fireEvent.click(maxButton);

    // Check input value was updated correctly
    await waitFor(() =>
      expect((getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement).value).toEqual('10'),
    );
  });

  it('lets the user bridge XVS', async () => {
    const mockBridgeXvs = vi.fn();
    (useBridgeXvs as Mock).mockImplementation(() => ({
      mutateAsync: mockBridgeXvs,
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

    await waitFor(() => expect(mockBridgeXvs).toHaveBeenCalledTimes(1));
    expect(mockBridgeXvs).toHaveBeenCalledWith(fakeBridgeXvsParams);
  });

  it('warns the user they are over the single transaction limit amount', async () => {
    const fakeBridgeDataLowSingleTransactionLimit = {
      ...fakeBridgeStatusData,
      maxSingleTransactionLimitUsd: new BigNumber('0'),
    };
    (useGetXvsBridgeStatus as Mock).mockImplementation(() => ({
      data: fakeBridgeDataLowSingleTransactionLimit,
    }));

    const { getByText, getByTestId } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      chainId: ChainId.BSC_TESTNET,
    });

    // Click on max button
    const maxButton = await waitFor(
      () => getByText(en.bridgePage.amountInput.maxButtonLabel) as HTMLButtonElement,
    );
    fireEvent.click(maxButton);

    // Check input value was updated correctly
    await waitFor(() =>
      expect((getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement).value).toEqual('10'),
    );

    // Check the warning shown to the user
    await waitFor(() =>
      expect(getByTestId(TEST_IDS.notice).textContent).toMatchInlineSnapshot(
        `"You cannot bridge more than 0 XVS ($0) on the destination chain in a single transaction"`,
      ),
    );

    // Check if submit button is disabled and its label
    const submitButton = await waitFor(
      () =>
        getByText(en.bridgePage.errors.singleTransactionLimitExceeded.submitButton).closest(
          'button',
        ) as HTMLButtonElement,
    );

    await waitFor(() => expect(submitButton).toBeDisabled());
  });

  it('warns the user they are over the daily transaction limit', async () => {
    // totalTransferredLast24HourUsd has reached the maxDailyLimitUsd
    const fakeBridgeDataLowDailyLimit = {
      ...fakeBridgeStatusData,
      totalTransferredLast24HourUsd: fakeMaxDailyLimitUsd,
    };
    (useGetXvsBridgeStatus as Mock).mockImplementation(() => ({
      data: fakeBridgeDataLowDailyLimit,
    }));

    const { getByText, getByTestId } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      chainId: ChainId.BSC_TESTNET,
    });

    // Click on max button
    const maxButton = await waitFor(
      () => getByText(en.bridgePage.amountInput.maxButtonLabel) as HTMLButtonElement,
    );
    fireEvent.click(maxButton);

    // Check input value was updated correctly
    await waitFor(() =>
      expect((getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement).value).toEqual('10'),
    );

    // Check the warning shown to the user
    await waitFor(() =>
      expect(getByTestId(TEST_IDS.notice).textContent).toMatchInlineSnapshot(
        `"You cannot bridge more than 0 XVS ($0) on the destination chain due to the 24-hour limit. This limit will be reset on Jan 13, 2024 12:00 PM"`,
      ),
    );

    // Check if submit button is disabled and its label
    const submitButton = await waitFor(
      () =>
        getByText(en.bridgePage.errors.dailyTransactionLimitExceeded.submitButton).closest(
          'button',
        ) as HTMLButtonElement,
    );

    await waitFor(() => expect(submitButton).toBeDisabled());
  });

  it('validates the daily transaction limit based on the maxDailyLimitUsd, if outside the 24 hour window', async () => {
    // test will run outside the 24 hour daily transaction window
    const fakeNowFutureDate = fromUnixTime(fakeDailyLimitResetTimestamp.toNumber());
    fakeNowFutureDate.setDate(fakeNowDate.getDate() + 1);
    vi.useFakeTimers().setSystemTime(fakeNowFutureDate);
    // totalTransferredLast24HourUsd will be an old value, validation should consider maxDailyLimitUsd instead
    const fakeBridgeDataLowDailyLimit = {
      ...fakeBridgeStatusData,
      totalTransferredLast24HourUsd: fakeMaxDailyLimitUsd,
    };
    (useGetXvsBridgeStatus as Mock).mockImplementation(() => ({
      data: fakeBridgeDataLowDailyLimit,
    }));

    const { getByText, getByTestId } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      chainId: ChainId.BSC_TESTNET,
    });

    // Click on max button
    const maxButton = await waitFor(
      () => getByText(en.bridgePage.amountInput.maxButtonLabel) as HTMLButtonElement,
    );
    fireEvent.click(maxButton);

    // Check input value was updated correctly
    await waitFor(() =>
      expect((getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement).value).toEqual('10'),
    );

    // Check if submit button is enabled and its label
    const submitButton = await waitFor(
      () =>
        getByText(en.bridgePage.submitButton.label.submit).closest('button') as HTMLButtonElement,
    );

    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('warns the user they cannot bridge over the mint cap', async () => {
    const fakeBridgeMintStatusData = {
      minterToCapMantissa: new BigNumber('10000000000000000000'),
      bridgeAmountMintedMantissa: new BigNumber('9000000000000000000'),
    };
    (useGetXvsBridgeMintStatus as Mock).mockImplementation(() => ({
      data: fakeBridgeMintStatusData,
    }));

    const { getByText, getByTestId } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      chainId: ChainId.BSC_TESTNET,
    });

    // Click on max button
    const maxButton = await waitFor(
      () => getByText(en.bridgePage.amountInput.maxButtonLabel) as HTMLButtonElement,
    );
    fireEvent.click(maxButton);

    // Check input value was updated correctly
    await waitFor(() =>
      expect((getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement).value).toEqual('10'),
    );

    // Check the warning shown to the user
    await waitFor(() =>
      expect(getByTestId(TEST_IDS.notice).textContent).toMatchInlineSnapshot(
        '"You cannot bridge more than 1 XVS due to the bridge mint cap"',
      ),
    );

    // Check if submit button is disabled and its label
    const submitButton = await waitFor(
      () =>
        getByText(en.bridgePage.errors.mintCapReached.submitButton).closest(
          'button',
        ) as HTMLButtonElement,
    );

    await waitFor(() => expect(submitButton).toBeDisabled());
  });

  it('show no warning about minting caps if there is no mint status data', async () => {
    // simulate returning no mint status data if the destination chain is BSC
    const fakeBridgeMintStatusData = undefined;
    (useGetXvsBridgeMintStatus as Mock).mockImplementation(() => ({
      data: fakeBridgeMintStatusData,
    }));
    const { queryByTestId, getByTestId, getByText } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      chainId: ChainId.SEPOLIA,
    });
    expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
      String(ChainId.BSC_TESTNET),
    );

    // Click on max button
    const maxButton = await waitFor(
      () => getByText(en.bridgePage.amountInput.maxButtonLabel) as HTMLButtonElement,
    );
    fireEvent.click(maxButton);

    // Check input value was updated correctly
    await waitFor(() =>
      expect((getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement).value).toEqual('10'),
    );

    // Check the warning is not shown to the user
    await waitFor(() => expect(queryByTestId(TEST_IDS.notice)).toBeNull());

    // Check if submit button is enabled
    const submitButton = await waitFor(
      () =>
        getByText(en.bridgePage.submitButton.label.submit).closest('button') as HTMLButtonElement,
    );

    await waitFor(() => expect(submitButton).toBeEnabled());
  });

  it('does not offer a destination chain whose bridge lane is closed on-chain', async () => {
    mockOpenBridgeLanes([ChainId.OPBNB_TESTNET]);

    const { getByTestId, getAllByText, queryByText } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      chainId: ChainId.BSC_TESTNET,
    });

    // the default destination (Sepolia) is closed, so the form moves onto the only open lane
    await waitFor(() =>
      expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.OPBNB_TESTNET),
      ),
    );

    // open the "To" dropdown
    fireEvent.click(getByTestId(TEST_IDS.toChainIdSelect).closest('button')!);

    // the open lane is listed as an option, on top of being the selected one
    await waitFor(() =>
      expect(getAllByText(chains[ChainId.OPBNB_TESTNET].name).length).toBeGreaterThan(1),
    );

    // none of the closed lanes is offered
    for (const closedChainId of closedTestnetLaneChainIds) {
      expect(queryByText(chains[closedChainId].name)).toBeNull();
    }
  });

  it('offers every configured destination chain while the lane limits are unknown', async () => {
    (useGetXvsBridgeDestinationLimits as Mock).mockImplementation(() => ({
      data: undefined,
    }));

    const { getByTestId, getAllByText } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      chainId: ChainId.BSC_TESTNET,
    });

    await waitFor(() =>
      expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.SEPOLIA),
      ),
    );

    fireEvent.click(getByTestId(TEST_IDS.toChainIdSelect).closest('button')!);

    await waitFor(() =>
      expect(getAllByText(chains[ChainId.OPBNB_TESTNET].name).length).toBeGreaterThan(0),
    );

    for (const chainId of closedTestnetLaneChainIds) {
      expect(getAllByText(chains[chainId].name).length).toBeGreaterThan(0);
    }
  });

  it('keeps the configured destination chains when no lane out of the source chain is open', async () => {
    mockOpenBridgeLanes([]);

    const { getByTestId, getAllByText } = renderComponent(<Bridge />, {
      accountAddress: fakeAccountAddress,
      chainId: ChainId.BSC_TESTNET,
    });

    // narrowing the list to nothing would leave the select without a selected option, so the
    // destinations are kept and the amount field reports the actual on-chain limit instead
    await waitFor(() =>
      expect((getByTestId(TEST_IDS.toChainIdSelect) as HTMLInputElement).value).toEqual(
        String(ChainId.SEPOLIA),
      ),
    );

    fireEvent.click(getByTestId(TEST_IDS.toChainIdSelect).closest('button')!);

    await waitFor(() =>
      expect(getAllByText(chains[ChainId.OPBNB_TESTNET].name).length).toBeGreaterThan(0),
    );
  });

  describe('when running in Safe Wallet app', () => {
    beforeEach(() => {
      config.isSafeApp = true;
    });

    afterEach(() => {
      config.isSafeApp = false;
    });

    it('disables from chain ID select when running in Safe Wallet app', async () => {
      const { getByTestId } = renderComponent(<Bridge />, {
        accountAddress: fakeAccountAddress,
        chainId: ChainId.BSC_TESTNET,
      });

      // Verify that the fromChainIdSelect is disabled
      expect(getByTestId(TEST_IDS.fromChainIdSelect)).toBeDisabled();
    });
  });
});
