import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';

import { ChainId, PSTokenCombination } from 'types';

import { busd, eth, wbnb, xvs } from './tokens';

const tokenCombinations: PSTokenCombination[] = [
  [busd, eth],
  [busd, xvs],
  [busd, wbnb],
  [eth, busd],
  [eth, xvs],
  [eth, wbnb],
  [xvs, eth],
  [xvs, busd],
  [xvs, wbnb],
  [wbnb, busd],
  [wbnb, eth],
  [wbnb, xvs],
].map(([tokenA, tokenB]) => [
  new PSToken(ChainId.BSC_TESTNET, tokenA.address, tokenA.decimals, tokenA.symbol),
  new PSToken(ChainId.BSC_TESTNET, tokenB.address, tokenB.decimals, tokenB.symbol),
]);

export default tokenCombinations;
