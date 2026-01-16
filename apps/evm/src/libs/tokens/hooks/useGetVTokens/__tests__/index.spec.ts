import { vBusdCorePool, vLuna, vUsdc, vUsdtCorePool, vUst, vWeth } from '__mocks__/models/vTokens';
import { renderHook } from 'testUtils/render';

import { ChainId } from 'types';

import { useGetVTokens } from '..';

vi.mock('@venusprotocol/chains', async () => {
  const actual = (await vi.importActual('@venusprotocol/chains')) as any;

  return {
    ...actual,
    vTokens: {
      97: [vBusdCorePool, vLuna, vUsdc],
      11155111: [vUst, vWeth, vUsdtCorePool],
    },
  };
});

describe('useGetTokens', () => {
  it('returns tokens of the current chain', () => {
    const { result } = renderHook(() => useGetVTokens(), {
      chainId: ChainId.BSC_TESTNET,
    });

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "address": "0x08e0A5575De71037aE36AbfAfb516595fE68e5e4",
          "chainId": 97,
          "decimals": 8,
          "symbol": "vBUSD",
          "underlyingToken": {
            "address": "0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-busd-asset",
            "symbol": "BUSD",
          },
        },
        {
          "address": "0x9C3015191d39cF1930F92EB7e7BCbd020bCA286a",
          "chainId": 97,
          "decimals": 8,
          "symbol": "vLUNA",
          "underlyingToken": {
            "address": "0xf36160EC62E3B191EA375dadfe465E8Fa1F8CabB",
            "chainId": 97,
            "decimals": 6,
            "iconSrc": "fake-luna-asset",
            "symbol": "LUNA",
          },
        },
        {
          "address": "0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7",
          "chainId": 97,
          "decimals": 8,
          "symbol": "vUSDC",
          "underlyingToken": {
            "address": "0x16227D60f7a0e586C66B005219dfc887D13C9531",
            "chainId": 97,
            "decimals": 6,
            "iconSrc": "fake-usdc-asset",
            "symbol": "USDC",
          },
        },
      ]
    `);
  });

  it('returns vTokens of chain ID passed through input', () => {
    const { result } = renderHook(
      () =>
        useGetVTokens({
          chainId: ChainId.SEPOLIA,
        }),
      {
        chainId: ChainId.BSC_TESTNET,
      },
    );

    expect(result.current).toMatchInlineSnapshot(`
      [
        {
          "address": "0xF206af85BC2761c4F876d27Bd474681CfB335EfA",
          "chainId": 97,
          "decimals": 8,
          "symbol": "vUST",
          "underlyingToken": {
            "address": "0x5A79efD958432E72211ee73D5DDFa9bc8f248b5F",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-ust-asset",
            "symbol": "UST",
          },
        },
        {
          "address": "0xc2931B1fEa69b6D6dA65a50363A8D75d285e4da9",
          "chainId": 97,
          "decimals": 8,
          "symbol": "vWETH",
          "underlyingToken": {
            "address": "0x700868CAbb60e90d77B6588ce072d9859ec8E281",
            "chainId": 97,
            "decimals": 18,
            "iconSrc": "fake-weth-asset",
            "symbol": "WETH",
            "tokenWrapped": {
              "address": "0x98f7A83361F7Ac8765CcEBAB1425da6b341958a7",
              "chainId": 97,
              "decimals": 18,
              "iconSrc": "fake-eth-asset",
              "isNative": true,
              "symbol": "ETH",
            },
          },
        },
        {
          "address": "0xb7526572FFE56AB9D7489838Bf2E18e3323b441A",
          "chainId": 97,
          "decimals": 8,
          "symbol": "vUSDT",
          "underlyingToken": {
            "address": "0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c",
            "chainId": 97,
            "decimals": 6,
            "iconSrc": "fake-usdt-asset",
            "symbol": "USDT",
          },
        },
      ]
    `);
  });
});
