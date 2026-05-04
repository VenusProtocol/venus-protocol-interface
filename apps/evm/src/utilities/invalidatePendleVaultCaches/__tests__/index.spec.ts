import fakeAccountAddress, {
  altAddress as fakePoolComptrollerAddress,
} from '__mocks__/models/address';
import { bnb, xvs } from '__mocks__/models/tokens';
import BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import type { Mock } from 'vitest';
import { invalidatePendleVaultCaches } from '..';

const fakeInput = {
  amountMantissa: new BigNumber('1000000000000000000'),
  fromToken: xvs,
  swapQuote: {},
  toToken: bnb,
  type: 'deposit',
} as Parameters<typeof invalidatePendleVaultCaches>[0]['input'];

const fakeChainId = xvs.chainId;

describe('utilities/invalidatePendleVaultCaches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invalidates all expected queries when pool comptroller address is provided', () => {
    invalidatePendleVaultCaches({
      input: fakeInput,
      chainId: fakeChainId,
      accountAddress: fakeAccountAddress,
      poolComptrollerAddress: fakePoolComptrollerAddress,
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(8);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toEqual([
      [
        {
          queryKey: [
            FunctionKey.GET_BALANCE_OF,
            {
              chainId: fakeChainId,
              accountAddress: fakeAccountAddress,
              tokenAddress: xvs.address,
            },
          ],
        },
      ],
      [
        {
          queryKey: [
            FunctionKey.GET_TOKEN_ALLOWANCE,
            {
              chainId: fakeChainId,
              tokenAddress: xvs.address,
              accountAddress: fakeAccountAddress,
              spenderAddress: fakePoolComptrollerAddress,
            },
          ],
        },
      ],
      [
        {
          queryKey: [
            FunctionKey.GET_BALANCE_OF,
            {
              chainId: fakeChainId,
              accountAddress: fakeAccountAddress,
              tokenAddress: bnb.address,
            },
          ],
        },
      ],
      [
        {
          queryKey: [
            FunctionKey.GET_TOKEN_BALANCES,
            {
              chainId: fakeChainId,
              accountAddress: fakeAccountAddress,
            },
          ],
        },
      ],
      [
        {
          queryKey: [
            FunctionKey.GET_FIXED_RATED_VAULTS,
            {
              chainId: fakeChainId,
            },
          ],
        },
      ],
      [{ queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL] }],
      [{ queryKey: [FunctionKey.GET_POOLS] }],
      [{ queryKey: [FunctionKey.GET_FIXED_RATED_VAULTS] }],
    ]);
  });

  it('skips token allowance invalidation when pool comptroller address is not provided', () => {
    invalidatePendleVaultCaches({
      input: fakeInput,
      chainId: fakeChainId,
      accountAddress: fakeAccountAddress,
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(7);
    expect((queryClient.invalidateQueries as Mock).mock.calls).toEqual([
      [
        {
          queryKey: [
            FunctionKey.GET_BALANCE_OF,
            {
              chainId: fakeChainId,
              accountAddress: fakeAccountAddress,
              tokenAddress: xvs.address,
            },
          ],
        },
      ],
      [
        {
          queryKey: [
            FunctionKey.GET_BALANCE_OF,
            {
              chainId: fakeChainId,
              accountAddress: fakeAccountAddress,
              tokenAddress: bnb.address,
            },
          ],
        },
      ],
      [
        {
          queryKey: [
            FunctionKey.GET_TOKEN_BALANCES,
            {
              chainId: fakeChainId,
              accountAddress: fakeAccountAddress,
            },
          ],
        },
      ],
      [
        {
          queryKey: [
            FunctionKey.GET_FIXED_RATED_VAULTS,
            {
              chainId: fakeChainId,
            },
          ],
        },
      ],
      [{ queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL] }],
      [{ queryKey: [FunctionKey.GET_POOLS] }],
      [{ queryKey: [FunctionKey.GET_FIXED_RATED_VAULTS] }],
    ]);
  });
});
