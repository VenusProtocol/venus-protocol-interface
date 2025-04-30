import fakeAccountAddress from '__mocks__/models/address';
import { vXvs } from '__mocks__/models/vTokens';
import { queryClient } from 'clients/api';

import { renderHook } from 'testUtils/render';

import { ChainId } from '@venusprotocol/chains';
import FunctionKey from 'constants/functionKey';
import { useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getNativeTokenGatewayContractAddress } from 'libs/contracts';
import { usePublicClient } from 'libs/wallet';
import type { Mock } from 'vitest';
import { useBorrow } from '..';

vi.mock('libs/analytics');
vi.mock('libs/contracts');

const fakeInput = {
  vToken: vXvs,
  poolName: 'Pool 1',
  poolComptrollerAddress: '0x456',
  amountMantissa: 1000n,
  unwrap: false,
};

const fakeOptions = {
  gasless: true,
  waitForConfirmation: true,
};

describe('useBorrow', () => {
  beforeEach(() => {
    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: {
        createAccessList: vi.fn(),
      },
    }));
  });

  it('calls useSendTransaction with the correct parameters for regular borrow', async () => {
    const mockCaptureAnalyticEvent = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      captureAnalyticEvent: mockCaptureAnalyticEvent,
    }));

    renderHook(() => useBorrow(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    expect(useSendTransaction).toHaveBeenCalledWith({
      fn: expect.any(Function),
      onConfirmed: expect.any(Function),
      options: fakeOptions,
    });

    const { fn, onConfirmed } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn(fakeInput)).toEqual({
      abi: expect.any(Array),
      address: fakeInput.vToken.address,
      functionName: 'borrow',
      args: [fakeInput.amountMantissa],
    });

    onConfirmed({ input: fakeInput });

    expect(mockCaptureAnalyticEvent).toHaveBeenCalledWith('Tokens borrowed', {
      poolName: fakeInput.poolName,
      tokenSymbol: fakeInput.vToken.underlyingToken.symbol,
      tokenAmountTokens: expect.any(Number),
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_TOKEN_BALANCES,
        {
          chainId: ChainId.BSC_TESTNET,
          accountAddress: fakeAccountAddress,
        },
      ],
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [
        FunctionKey.GET_BALANCE_OF,
        {
          chainId: ChainId.BSC_TESTNET,
          accountAddress: fakeAccountAddress,
          vTokenAddress: fakeInput.vToken.underlyingToken.address,
        },
      ],
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: [FunctionKey.GET_POOLS],
    });
  });

  it('handles borrow and unwrap flow when native token gateway contract is available', async () => {
    const nativeTokenGatewayAddress = '0x789';
    (getNativeTokenGatewayContractAddress as Mock).mockReturnValue(nativeTokenGatewayAddress);

    renderHook(() => useBorrow(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(await fn({ ...fakeInput, unwrap: true })).toEqual({
      abi: expect.any(Array),
      address: nativeTokenGatewayAddress,
      functionName: 'borrowAndUnwrap',
      args: [fakeInput.amountMantissa],
    });
  });

  it('throws error when trying to unwrap without native token gateway contract', async () => {
    (getNativeTokenGatewayContractAddress as Mock).mockReturnValue(undefined);

    renderHook(() => useBorrow(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    expect(fn({ ...fakeInput, unwrap: true })).rejects.toThrow();
  });

  it('adds access list for native token borrows', async () => {
    const fakeAccessList = [{ address: '0x123', storageKeys: ['0x456'] }];
    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: {
        createAccessList: vi.fn().mockResolvedValue({ accessList: fakeAccessList }),
      },
    }));

    renderHook(() => useBorrow(fakeOptions), {
      accountAddress: fakeAccountAddress,
    });

    const { fn } = (useSendTransaction as Mock).mock.calls[0][0];

    const result = await fn({
      ...fakeInput,
      vToken: {
        ...vXvs,
        underlyingToken: {
          ...vXvs.underlyingToken,
          isNative: true,
        },
      },
    });

    expect(result.accessList).toEqual(fakeAccessList);
  });
});
