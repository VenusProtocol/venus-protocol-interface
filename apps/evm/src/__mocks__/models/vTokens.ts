import type { VToken } from 'types';

import { bnb, busd, eth, lisUsd, luna, usdc, usdt, ust, wbnb, weth, xvs } from './tokens';

// Note: we don't import ChainId because this causes some hoisting issues with tests
const BSC_TESTNET_ID = 97;

export const vXvs: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x6d6F697e34145Bb95c54E77482d97cc261Dc237E',
  decimals: 8,
  symbol: 'vXVS',
  underlyingToken: xvs,
};

export const vBnb: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c',
  decimals: 8,
  symbol: 'vBNB',
  underlyingToken: bnb,
};

export const vUsdc: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
  decimals: 8,
  symbol: 'vUSDC',
  underlyingToken: usdc,
};

export const vUsdtCorePool: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
  decimals: 8,
  symbol: 'vUSDT',
  underlyingToken: usdt,
};

export const vUsdtDeFi: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x80CC30811e362aC9aB857C3d7875CbcCc0b65750',
  decimals: 8,
  symbol: 'vUSDT_DeFi',
  underlyingToken: usdt,
};

export const vUsdtGameFi: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x0bFE4e0B8A2a096A27e5B18b078d25be57C08634',
  decimals: 8,
  symbol: 'vUSDT_GameFi',
  underlyingToken: usdt,
};

export const vUsdtLiquidStakedBnb: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x2197d02cC9cd1ad51317A0a85A656a0c82383A7c',
  decimals: 8,
  symbol: 'vUSDT_Liquid_Staked_BNB',
  underlyingToken: usdt,
};

export const vUsdtMeme: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x3AF2bE7AbEF0f840b196D99d79F4B803a5dB14a1',
  decimals: 8,
  symbol: 'vUSDT_Meme',
  underlyingToken: usdt,
};

export const vUsdtStablecoins: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x3338988d0beb4419Acb8fE624218754053362D06',
  decimals: 8,
  symbol: 'vUSDT_Stablecoins',
  underlyingToken: usdt,
};

export const vUsdtTron: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x712774CBFFCBD60e9825871CcEFF2F917442b2c3',
  decimals: 8,
  symbol: 'vUSDT_Tron',
  underlyingToken: usdt,
};

export const vBusdCorePool: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
  decimals: 8,
  symbol: 'vBUSD',
  underlyingToken: busd,
};

export const vBusdStablecoins: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x8c8A1a0b6e1cb8058037F7bF24de6b79Aca5B7B0',
  decimals: 8,
  symbol: 'vBUSD',
  underlyingToken: busd,
};

export const vUst: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0xF206af85BC2761c4F876d27Bd474681CfB335EfA',
  decimals: 8,
  symbol: 'vUST',
  underlyingToken: ust,
};

export const vLuna: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x9C3015191d39cF1930F92EB7e7BCbd020bCA286a',
  decimals: 8,
  symbol: 'vLUNA',
  underlyingToken: luna,
};

export const vWeth: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0xc2931B1fEa69b6D6dA65a50363A8D75d285e4da9',
  decimals: 8,
  symbol: 'vWETH',
  underlyingToken: weth,
};

export const vEth: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x86f8DfB7CA84455174EE9C3edd94867b51Da46BD',
  decimals: 8,
  symbol: 'vETH',
  underlyingToken: eth,
};

export const vLisUSD: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x170d3b2da05cc2124334240fB34ad1359e34C562',
  decimals: 8,
  symbol: 'vlisUSD',
  underlyingToken: lisUsd,
};

export const vWbnb: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x231dED0Dfc99634e52EE1a1329586bc970d773b3',
  decimals: 8,
  symbol: 'vWBNB',
  underlyingToken: wbnb,
};

export const vUsdtSpokeBstock: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0xC88bAF0bA49a98F15A00182752f6d10bd3932F6a',
  decimals: 8,
  symbol: 'vUSDT_bStock',
  underlyingToken: usdt,
};

export const vUsdcSpokeBstock: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0xD05514217FD359659aE7da7740e79C11947eBB32',
  decimals: 8,
  symbol: 'vUSDC_bStock',
  underlyingToken: usdc,
};

export const vXvsSpokeBstock: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x1A6c3c0A5A4cFf0BF1E5dF4b1F0C2d3E4f5A6b70',
  decimals: 8,
  symbol: 'vXVS_bStock',
  underlyingToken: xvs,
};

export const vEthSpokeBstock: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x2B7d4d1b6b5dA0cF2F6E4c5B7a8D9e0F1a2B3c41',
  decimals: 8,
  symbol: 'vETH_bStock',
  underlyingToken: eth,
};

export const vUsdtSpokeBluechips: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x3C8e5e2c7d6EB1d0a9F8b7C6d5E4f3A2b1C0d9E2',
  decimals: 8,
  symbol: 'vUSDT_Bluechips',
  underlyingToken: usdt,
};

export const vBusdSpokeBluechips: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x4D9f6f3d8e7FC2e1bA0c9D8e7F6a5B4c3D2e1F03',
  decimals: 8,
  symbol: 'vBUSD_Bluechips',
  underlyingToken: busd,
};

export const vBnbSpokeBluechips: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x5EaF7a4E9f8aD3f2cB1d0E9f8A7b6C5d4E3f2A14',
  decimals: 8,
  symbol: 'vBNB_Bluechips',
  underlyingToken: bnb,
};

export const vWbnbSpokeBluechips: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x6FB08b5f0A9bE403dC2e1F0a9B8c7D6e5F4a3B25',
  decimals: 8,
  symbol: 'vWBNB_Bluechips',
  underlyingToken: wbnb,
};

export const vUsdcSpokeRwa: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x70C19c6a1BaCf514eD3f2a1B0c9d8E7f6A5b4C36',
  decimals: 8,
  symbol: 'vUSDC_RWA',
  underlyingToken: usdc,
};

export const vWethSpokeRwa: VToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x81D2aD7b2CbD625fFE4a3b2C1d0e9F8a7B6c5D47',
  decimals: 8,
  symbol: 'vWETH_RWA',
  underlyingToken: weth,
};

export default [
  vXvs,
  vBnb,
  vUsdc,
  vUsdtCorePool,
  vUsdtDeFi,
  vUsdtGameFi,
  vUsdtLiquidStakedBnb,
  vUsdtMeme,
  vUsdtStablecoins,
  vUsdtTron,
  vBusdCorePool,
  vBusdStablecoins,
  vUst,
  vLuna,
  vEth,
  vLisUSD,
  vWbnb,
];
