import { bnb, busd, usdc, usdt, vai, xvs } from '__mocks__/models/tokens';
import { renderHook } from 'testUtils/render';

import { ChainId } from 'types';

import { useGetTokens } from '..';

vi.mock('@venusprotocol/chains', async () => {
  const actual = (await vi.importActual('@venusprotocol/chains')) as any;

  return {
    ...actual,
    tokens: {
      97: [bnb, busd, usdc],
      11155111: [usdt, xvs, vai],
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
          "address": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
          "chainId": 97,
          "decimals": 18,
          "iconSrc": "fake-bnb-asset",
          "isNative": true,
          "symbol": "BNB",
        },
        {
          "address": "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
          "chainId": 97,
          "decimals": 18,
          "iconSrc": "fake-busd-asset",
          "symbol": "BUSD",
        },
        {
          "address": "0x16227D60f7a0e586C66B005219dfc887D13C9531",
          "chainId": 97,
          "decimals": 6,
          "iconSrc": "fake-usdc-asset",
          "symbol": "USDC",
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
          "address": "0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c",
          "chainId": 97,
          "decimals": 6,
          "iconSrc": "fake-usdt-asset",
          "symbol": "USDT",
        },
        {
          "address": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
          "chainId": 97,
          "decimals": 18,
          "iconSrc": "fake-xvs-asset",
          "symbol": "XVS",
        },
        {
          "address": "0x5fFbE5302BadED40941A403228E6AD03f93752d9",
          "chainId": 97,
          "decimals": 18,
          "iconSrc": "fake-vai-asset",
          "symbol": "VAI",
        },
      ]
    `);
  });
});
