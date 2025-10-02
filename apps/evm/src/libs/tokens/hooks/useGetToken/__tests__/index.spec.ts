import { ChainId, getToken } from '@venusprotocol/chains';

import { renderHook } from 'testUtils/render';

import { useGetToken } from '..';

const fakeSymbol = 'XVS';

vi.mock('@venusprotocol/chains', async () => {
  const actual = (await vi.importActual('@venusprotocol/chains')) as any;

  return {
    ...actual,
    getToken: vi.fn(() => ({
      address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
      decimals: 18,
      symbol: 'XVS',
      asset: 'fake-xvs-asset',
    })),
  };
});

describe('useGetToken', () => {
  it('returns token of the current chain', () => {
    const { result } = renderHook(
      () =>
        useGetToken({
          symbol: fakeSymbol,
        }),
      {
        chainId: ChainId.BSC_TESTNET,
      },
    );

    expect(result.current).toMatchInlineSnapshot(`
      {
        "address": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
        "asset": "fake-xvs-asset",
        "decimals": 18,
        "symbol": "XVS",
      }
    `);
    expect(getToken).toHaveBeenCalledWith({ chainId: ChainId.BSC_TESTNET, symbol: fakeSymbol });
  });

  it('returns tokens of chain ID passed through input', () => {
    const { result } = renderHook(
      () =>
        useGetToken({
          symbol: fakeSymbol,
          chainId: ChainId.SEPOLIA,
        }),
      {
        chainId: ChainId.BSC_TESTNET,
      },
    );

    expect(result.current).toMatchInlineSnapshot(`
      {
        "address": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
        "asset": "fake-xvs-asset",
        "decimals": 18,
        "symbol": "XVS",
      }
    `);
    expect(getToken).toHaveBeenCalledWith({ chainId: ChainId.SEPOLIA, symbol: fakeSymbol });
  });
});
