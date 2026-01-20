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
