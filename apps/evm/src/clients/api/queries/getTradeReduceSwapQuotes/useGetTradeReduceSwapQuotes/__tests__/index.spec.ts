import { act, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import { busd, usdc, xvs } from '__mocks__/models/tokens';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import { useGetTradeReduceSwapQuotes } from '..';
import * as getTradeReduceSwapQuotesQueries from '../..';

const baseInput = {
  dsaToken: xvs,
  shortToken: busd,
  shortAmountToRepayTokens: new BigNumber(10),
  longToken: usdc,
  longAmountToWithdrawTokens: new BigNumber(20),
  closeFractionPercentage: 50,
  isPositionShortBalanceZero: false,
  slippagePercentage: 0.5,
};

const createDeferred = <T>() => {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>(promiseResolve => {
    resolve = promiseResolve;
  });

  return {
    promise,
    resolve,
  };
};

describe('useGetTradeReduceSwapQuotes', () => {
  beforeEach(() => {
    (useGetContractAddress as Mock).mockImplementation(({ name }: { name: string }) => ({
      address: `0xfake${name}ContractAddress`,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls getTradeReduceSwapQuotes with the expected parameters', async () => {
    const fakeOutput = {
      pnlDsaTokens: new BigNumber(1),
    };

    const getTradeReduceSwapQuotesSpy = vi
      .spyOn(getTradeReduceSwapQuotesQueries, 'getTradeReduceSwapQuotes')
      .mockResolvedValue(fakeOutput);

    const { result } = renderHook(() => useGetTradeReduceSwapQuotes(baseInput), {
      chainId: ChainId.BSC_MAINNET,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getTradeReduceSwapQuotesSpy).toHaveBeenCalledWith({
      ...baseInput,
      chainId: ChainId.BSC_MAINNET,
      leverageManagerContractAddress: '0xfakeLeverageManagerContractAddress',
      relativePositionManagerContractAddress: '0xfakeRelativePositionManagerContractAddress',
    });
    expect(result.current.data).toEqual(fakeOutput);
  });

  it('throws when a required contract address is missing', async () => {
    const getTradeReduceSwapQuotesSpy = vi.spyOn(
      getTradeReduceSwapQuotesQueries,
      'getTradeReduceSwapQuotes',
    );

    (useGetContractAddress as Mock).mockImplementation(({ name }: { name: string }) => ({
      address: name === 'RelativePositionManager' ? undefined : `0xfake${name}ContractAddress`,
    }));

    const { result } = renderHook(() => useGetTradeReduceSwapQuotes(baseInput));

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('couldNotRetrieveSigner');
    expect(getTradeReduceSwapQuotesSpy).not.toHaveBeenCalled();
  });

  it('keeps the previous data while refetching quotes for the same position', async () => {
    const initialOutput = {
      pnlDsaTokens: new BigNumber(1),
    };
    const nextOutput = {
      pnlDsaTokens: new BigNumber(2),
    };
    const deferred = createDeferred<typeof nextOutput>();

    vi.spyOn(getTradeReduceSwapQuotesQueries, 'getTradeReduceSwapQuotes')
      .mockResolvedValueOnce(initialOutput)
      .mockImplementationOnce(() => deferred.promise);

    let input = baseInput;

    const { result, rerender } = renderHook(() => useGetTradeReduceSwapQuotes(input));

    await waitFor(() => expect(result.current.data).toEqual(initialOutput));

    input = {
      ...baseInput,
      shortAmountToRepayTokens: new BigNumber(15),
      longAmountToWithdrawTokens: new BigNumber(30),
    };

    act(() => {
      rerender();
    });

    expect(result.current.data).toEqual(initialOutput);

    deferred.resolve(nextOutput);

    await waitFor(() => expect(result.current.data).toEqual(nextOutput));
  });

  it('clears the previous data while refetching quotes for a different position', async () => {
    const initialOutput = {
      pnlDsaTokens: new BigNumber(1),
    };
    const deferred = createDeferred<typeof initialOutput>();

    vi.spyOn(getTradeReduceSwapQuotesQueries, 'getTradeReduceSwapQuotes')
      .mockResolvedValueOnce(initialOutput)
      .mockImplementationOnce(() => deferred.promise);

    let input = baseInput;

    const { result, rerender } = renderHook(() => useGetTradeReduceSwapQuotes(input));

    await waitFor(() => expect(result.current.data).toEqual(initialOutput));

    input = {
      ...baseInput,
      closeFractionPercentage: 25,
    };

    act(() => {
      rerender();
    });

    expect(result.current.data).toBeUndefined();

    deferred.resolve({
      pnlDsaTokens: new BigNumber(3),
    });

    await waitFor(() => expect(result.current.data?.pnlDsaTokens.isEqualTo(3)).toBe(true));
  });
});
