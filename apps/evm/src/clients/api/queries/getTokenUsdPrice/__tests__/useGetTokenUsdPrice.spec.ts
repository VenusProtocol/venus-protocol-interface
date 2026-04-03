import { waitFor } from '@testing-library/dom';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { busd, xvs } from '__mocks__/models/tokens';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetToken } from 'libs/tokens';
import { usePublicClient } from 'libs/wallet';
import { renderHook } from 'testUtils/render';
import { ChainId } from 'types';
import { XVS_FIXED_PRICE_CENTS } from 'utilities/xvsPriceOnZk/constants';
import type { PublicClient } from 'viem';
import { useGetTokenUsdPrice } from '../useGetTokenUsdPrice';

const fakePublicClient = {
  readContract: vi.fn(async () => 1000000000000000000n),
} as unknown as PublicClient;

describe('useGetTokenUsdPrice', () => {
  beforeEach(() => {
    (usePublicClient as Mock).mockImplementation(() => ({
      publicClient: fakePublicClient,
    }));

    (useGetContractAddress as Mock).mockImplementation(() => ({
      address: fakeAddress,
    }));

    (useGetToken as Mock).mockImplementation(({ symbol }: { symbol: string }) => {
      if (symbol === 'XVS') {
        return xvs;
      }
      return undefined;
    });
  });

  it('fetches token price from oracle for non-XVS tokens', async () => {
    const { result } = renderHook(() => useGetTokenUsdPrice({ token: busd }));

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data?.tokenPriceUsd).toBeInstanceOf(BigNumber);
  });

  it('returns fixed price for XVS on zkSync mainnet without calling oracle', async () => {
    const { result } = renderHook(() => useGetTokenUsdPrice({ token: xvs }), {
      chainId: ChainId.ZKSYNC_MAINNET,
    });

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data?.tokenPriceUsd).toEqual(
      new BigNumber(XVS_FIXED_PRICE_CENTS).shiftedBy(-2),
    );
  });

  it('returns fixed price for XVS on zkSync sepolia without calling oracle', async () => {
    const { result } = renderHook(() => useGetTokenUsdPrice({ token: xvs }), {
      chainId: ChainId.ZKSYNC_SEPOLIA,
    });

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data?.tokenPriceUsd).toEqual(
      new BigNumber(XVS_FIXED_PRICE_CENTS).shiftedBy(-2),
    );
  });

  it('fetches XVS price from oracle on non-zkSync chains', async () => {
    const { result } = renderHook(() => useGetTokenUsdPrice({ token: xvs }));

    await waitFor(() => expect(result.current.data).toBeDefined());

    expect(result.current.data?.tokenPriceUsd).toBeInstanceOf(BigNumber);
  });
});
