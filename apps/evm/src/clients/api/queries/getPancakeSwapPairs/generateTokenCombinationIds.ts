import { PSTokenCombination } from 'types';

const generateTokenCombinationIds = (tokenCombinations: PSTokenCombination[]) =>
  tokenCombinations
    .map(tokenCombination => `${tokenCombination[0].address}-${tokenCombination[1].address}`)
    // Sort generated IDs to output the same data when providing the same token
    // combinations in a different order. This prevents unnecessary processing
    // when using the IDs as query key
    .sort();

export default generateTokenCombinationIds;
