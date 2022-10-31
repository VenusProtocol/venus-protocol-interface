import { TokenCombination } from './types';

const generateTokenCombinationId = (tokenCombination: TokenCombination) =>
  `${tokenCombination[0].address}-${tokenCombination[0].address}`;

export default generateTokenCombinationId;
