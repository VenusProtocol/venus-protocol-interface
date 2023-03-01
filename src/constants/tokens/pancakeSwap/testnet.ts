import { Token } from 'types';

import bnb from 'assets/img/tokens/bnb.svg';

export const TESTNET_PANCAKE_SWAP_TOKENS = {
  bnb: {
    symbol: 'BNB',
    decimals: 18,
    address: '',
    asset: bnb,
    isNative: true,
  } as Token,
  cake: {
    symbol: 'CAKE',
    decimals: 18,
    address: '0xFa60D973F7642B748046464e165A65B7323b0DEE',
    asset:
      'https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg',
  } as Token,
  busd: {
    symbol: 'BUSD',
    decimals: 18,
    address: '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814',
    asset:
      'https://pancakeswap.finance/images/tokens/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.svg',
  } as Token,
  wbnb: {
    symbol: 'WBNB',
    decimals: 18,
    address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    asset:
      'https://pancakeswap.finance/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.svg',
  } as Token,
};
