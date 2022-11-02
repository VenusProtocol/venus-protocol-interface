import { TokenCombination } from './types';

const generateTokenCombinationIds = (tokenCombinations: TokenCombination[]) =>
  tokenCombinations
    .map(tokenCombination => `${tokenCombination[0].address}-${tokenCombination[0].address}`)
    // Sort generated IDs to output the same data when providing the same token
    // combinations in a different order. This prevents unnecessary processing
    // when using the IDs as query key
    .sort();

export default generateTokenCombinationIds;
