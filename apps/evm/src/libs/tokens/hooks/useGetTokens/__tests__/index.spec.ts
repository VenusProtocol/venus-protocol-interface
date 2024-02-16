import { getTokens } from '@venusprotocol/web3';

import tokens from '__mocks__/models/tokens';
import { renderHook } from 'testUtils/render';

import { ChainId } from 'types';

import { useGetTokens } from '..';

describe('useGetTokens', () => {
  it('returns tokens of the current chain', () => {
    const { result } = renderHook(() => useGetTokens(), {
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result.current).toBe(tokens);
    expect(getTokens).toHaveBeenCalledWith({
      chainId: ChainId.BSC_TESTNET,
    });
  });

  it('passes chainId parameter to getTokens when passed through input', () => {
    const { result } = renderHook(
      () =>
        useGetTokens({
          chainId: ChainId.SEPOLIA,
        }),
      {
        chainId: ChainId.BSC_TESTNET,
      },
    );

    expect(result.current).toBe(tokens);
    expect(getTokens).toHaveBeenCalledWith({
      chainId: ChainId.SEPOLIA,
    });
  });
});
