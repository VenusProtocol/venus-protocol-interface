import { Token } from 'types';

import { TESTNET_TOKENS } from '../common/testnet';

export const TESTNET_SWAP_TOKENS = {
  wbnb: {
    symbol: 'WBNB',
    decimals: 18,
    address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    asset:
      'https://pancakeswap.finance/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.svg',
  } as Token,
  ...TESTNET_TOKENS,
};
