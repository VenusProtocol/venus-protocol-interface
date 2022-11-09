import { Token as PSToken } from '@pancakeswap/sdk/dist/index.js';
import { BscChainId, PSTokenCombination } from 'types';

import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';

const tokenCombinations: PSTokenCombination[] = [
  [PANCAKE_SWAP_TOKENS.busd, PANCAKE_SWAP_TOKENS.cake],
  [PANCAKE_SWAP_TOKENS.busd, PANCAKE_SWAP_TOKENS.wbnb],
  [PANCAKE_SWAP_TOKENS.cake, PANCAKE_SWAP_TOKENS.wbnb],
  [PANCAKE_SWAP_TOKENS.cake, PANCAKE_SWAP_TOKENS.busd],
  [PANCAKE_SWAP_TOKENS.wbnb, PANCAKE_SWAP_TOKENS.busd],
  [PANCAKE_SWAP_TOKENS.wbnb, PANCAKE_SWAP_TOKENS.cake],
].map(([tokenA, tokenB]) => [
  new PSToken(BscChainId.TESTNET, tokenA.address, tokenA.decimals, tokenA.symbol),
  new PSToken(BscChainId.TESTNET, tokenB.address, tokenB.decimals, tokenB.symbol),
]);

export default tokenCombinations;
