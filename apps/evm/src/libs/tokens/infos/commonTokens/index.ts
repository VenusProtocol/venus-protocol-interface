import { ChainId } from 'types';

import { TokenMapping } from '../../types';
import { tokens as bscMainnetTokens } from './bscMainnet';
import { tokens as bscTestnetTokens } from './bscTestnet';
import { tokens as ethereumTokens } from './ethereum';
import { tokens as opBnbTestnetTokens } from './opBnbTestnet';
import { tokens as sepoliaTokens } from './sepolia';

export const tokens: TokenMapping = {
  [ChainId.BSC_MAINNET]: bscMainnetTokens,
  [ChainId.BSC_TESTNET]: bscTestnetTokens,
  [ChainId.OPBNB_TESTNET]: opBnbTestnetTokens,
  [ChainId.SEPOLIA]: sepoliaTokens,
  [ChainId.ETHEREUM]: ethereumTokens,
};
