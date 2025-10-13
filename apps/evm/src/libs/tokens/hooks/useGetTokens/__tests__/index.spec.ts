import { renderHook } from 'testUtils/render';

import { ChainId } from 'types';

import { useGetTokens } from '..';

vi.mock('@venusprotocol/chains', async () => {
  const actual = (await vi.importActual('@venusprotocol/chains')) as any;

  return {
    ...actual,
    tokens: {
      97: [
        {
          address: 'fake-bsc-testnet-address-0',
          decimals: 18,
          symbol: 'FakeSymbol0',
          asset: 'fake-asset-0',
        },
      ],
      11155111: [
        {
          address: 'fake-sepolia-address-1',
          decimals: 18,
          symbol: 'FakeSymbol1',
          asset: 'fake-asset-1',
        },
      ],
    },
  };
});

describe('useGetTokens', () => {
  it('returns tokens of the current chain', () => {
    const { result } = renderHook(() => useGetTokens(), {
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "address": "fake-bsc-testnet-address-0",
          "asset": "fake-asset-0",
          "decimals": 18,
          "symbol": "FakeSymbol0",
        },
      ]
    `);
  });

  it('returns tokens of chain ID passed through input', () => {
    const { result } = renderHook(
      () =>
        useGetTokens({
          chainId: ChainId.SEPOLIA,
        }),
      {
        chainId: ChainId.BSC_TESTNET,
      },
    );

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "address": "fake-sepolia-address-1",
          "asset": "fake-asset-1",
          "decimals": 18,
          "symbol": "FakeSymbol1",
        },
      ]
    `);
  });
});
