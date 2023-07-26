import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import { ChainId } from 'packages/contracts';
import { PSTokenCombination } from 'types';

import { SWAP_TOKENS } from 'constants/tokens';

const tokenCombinations: PSTokenCombination[] = [
  [SWAP_TOKENS.busd, SWAP_TOKENS.eth],
  [SWAP_TOKENS.busd, SWAP_TOKENS.xvs],
  [SWAP_TOKENS.busd, SWAP_TOKENS.wbnb],
  [SWAP_TOKENS.eth, SWAP_TOKENS.busd],
  [SWAP_TOKENS.eth, SWAP_TOKENS.xvs],
  [SWAP_TOKENS.eth, SWAP_TOKENS.wbnb],
  [SWAP_TOKENS.xvs, SWAP_TOKENS.eth],
  [SWAP_TOKENS.xvs, SWAP_TOKENS.busd],
  [SWAP_TOKENS.xvs, SWAP_TOKENS.wbnb],
  [SWAP_TOKENS.wbnb, SWAP_TOKENS.busd],
  [SWAP_TOKENS.wbnb, SWAP_TOKENS.eth],
  [SWAP_TOKENS.wbnb, SWAP_TOKENS.xvs],
].map(([tokenA, tokenB]) => [
  new PSToken(ChainId.BSC_TESTNET, tokenA.address, tokenA.decimals, tokenA.symbol),
  new PSToken(ChainId.BSC_TESTNET, tokenB.address, tokenB.decimals, tokenB.symbol),
]);

export default tokenCombinations;
