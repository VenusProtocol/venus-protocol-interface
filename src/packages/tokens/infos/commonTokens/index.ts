import { ChainId } from 'types';

import { TokenMapping } from '../../types';
import { tokens as bscMainnetTokens } from './bscMainnet';
import { tokens as bscTestnetTokens } from './bscTestnet';

export const tokens: TokenMapping = {
  [ChainId.BSC_MAINNET]: bscMainnetTokens,
  [ChainId.BSC_TESTNET]: bscTestnetTokens,
  [ChainId.SEPOLIA]: [], // TODO: add records (see VEN-2121)
  [ChainId.ETHEREUM]: [], // TODO: add records (see VEN-2120)
};
