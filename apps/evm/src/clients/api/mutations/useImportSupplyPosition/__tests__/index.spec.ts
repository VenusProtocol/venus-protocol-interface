import type {
  GetFusionQuotePayload,
  MeeClient,
  MultichainSmartAccount,
} from '@biconomy/abstractjs-canary';
import { ChainId } from '@venusprotocol/chains';
import fakeAccountAddress, {
  altAddress as fakeNexusAccountAddress,
} from '__mocks__/models/address';
import { importablePositions } from '__mocks__/models/importablePositions';
import { vUsdc } from '__mocks__/models/vTokens';
import { queryClient } from 'clients/api';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useMeeClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';
import { useImportSupplyPosition } from '..';

vi.mock('@biconomy/abstractjs-canary', () => ({
  ...vi.importActual('@biconomy/abstractjs-canary'),
  greaterThanOrEqualTo: vi.fn(() => true),
  runtimeERC20BalanceOf: vi.fn(() => 100n),
}));

const fakeInput = {
  position: importablePositions.aave[0],
  vToken: vUsdc,
};

const fakeOptions = {
  waitForConfirmation: true,
  onConfirmed: vi.fn(),
};

const fakeFustionQuote = {
  quote: {},
  trigger: {},
} as unknown as GetFusionQuotePayload;

const fakeMeeClient = {
  getFusionQuote: vi.fn(() => fakeFustionQuote),
} as unknown as MeeClient;

const fakeNexusAccount = {
  addressOn: vi.fn(() => fakeNexusAccountAddress),
  buildComposable: vi.fn(() => ({
    calls: [],
    chainId: ChainId.BSC_TESTNET,
  })),
} as unknown as MultichainSmartAccount;

describe('useImportSupplyPosition', () => {
  beforeEach(() => {
    (useMeeClient as Mock).mockImplementation(() => ({
      data: {
        meeClient: fakeMeeClient,
        nexusAccount: fakeNexusAccount,
      },
    }));
  });

  it('returns a Fusion quote on success', async () => {
    renderHook(() => useImportSupplyPosition(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { onConfirmed: _onConfirmed, ...expectedOptions } = fakeOptions;

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: expectedOptions,
      transactionType: 'biconomy',
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    const result = await fn(fakeInput);

    expect(result).toMatchInlineSnapshot(`
      {
        "quote": {},
        "trigger": {},
      }
    `);

    expect(fakeNexusAccount.buildComposable).toHaveBeenCalledTimes(4);

    (fakeNexusAccount.buildComposable as Mock).mock.calls.forEach(call => {
      if ('abi' in call[0].data) {
        expect(call[0]).toMatchSnapshot({
          data: {
            abi: expect.any(Array),
          },
        });
      } else {
        expect(call[0]).toMatchSnapshot();
      }
    });

    expect(fakeMeeClient.getFusionQuote).toHaveBeenCalledTimes(1);
    expect((fakeMeeClient.getFusionQuote as Mock).mock.calls).toMatchSnapshot();

    onConfirmed({ input: fakeInput });

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(4);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toMatchSnapshot();

    expect(fakeOptions.onConfirmed).toHaveBeenCalledTimes(1);
    expect((fakeOptions.onConfirmed as Mock).mock.calls).toMatchSnapshot();
  });

  it('throws when MEE Client could not be retrieved', async () => {
    (useMeeClient as Mock).mockImplementation(() => ({
      data: {
        meeClient: undefined,
        nexusAccount: fakeNexusAccount,
      },
    }));

    renderHook(() => useImportSupplyPosition(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when Nexus account could not be retrieved', async () => {
    (useMeeClient as Mock).mockImplementation(() => ({
      data: {
        meeClient: fakeMeeClient,
        nexusAccount: undefined,
      },
    }));

    renderHook(() => useImportSupplyPosition(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when Nexus account address could not be retrieved', async () => {
    (useMeeClient as Mock).mockImplementation(() => ({
      data: {
        meeClient: fakeMeeClient,
        nexusAccount: {
          addressOn: vi.fn(() => undefined),
        },
      },
    }));

    renderHook(() => useImportSupplyPosition(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when user account address could not be retrieved', async () => {
    renderHook(() => useImportSupplyPosition(fakeOptions));

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });

  it('throws when AaveV3Pool contract address could not be retrieved', async () => {
    (useGetContractAddress as Mock).mockReturnValue({ address: undefined });

    renderHook(() => useImportSupplyPosition(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    await expect(async () => fn(fakeInput)).rejects.toThrow('somethingWentWrong');
  });
});
