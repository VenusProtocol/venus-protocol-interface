import { ChainId } from 'types';

import type { DisabledTokenActionMapping } from '../../types';
import { disabledTokenActions as arbitrumOneDisabledTokenActions } from './arbitrumOne';
import { disabledTokenActions as arbitrumSepoliaDisabledTokenActions } from './arbitrumSepolia';
import { disabledTokenActions as baseMainnetDisabledTokenActions } from './baseMainnet';
import { disabledTokenActions as baseSepoliaDisabledTokenActions } from './baseSepolia';
import { disabledTokenActions as bscMainnetDisabledTokenActions } from './bscMainnet';
import { disabledTokenActions as bscTestnetDisabledTokenActions } from './bscTestnet';
import { disabledTokenActions as ethereumDisabledTokenActions } from './ethereum';
import { disabledTokenActions as opBnbMainnetDisabledTokenActions } from './opBnbMainnet';
import { disabledTokenActions as opBnbTestnetDisabledTokenActions } from './opBnbTestnet';
import { disabledTokenActions as optimismMainnetDisabledTokenActions } from './optimismMainnet';
import { disabledTokenActions as optimismSepoliaDisabledTokenActions } from './optimismSepolia';
import { disabledTokenActions as sepoliaDisabledTokenActions } from './sepolia';
import { disabledTokenActions as zkSyncMainnetDisabledTokenActions } from './zkSyncMainnet';
import { disabledTokenActions as zkSyncSepoliaDisabledTokenActions } from './zkSyncSepolia';

const disabledTokenActions: DisabledTokenActionMapping = {
  [ChainId.BSC_MAINNET]: bscMainnetDisabledTokenActions,
  [ChainId.BSC_TESTNET]: bscTestnetDisabledTokenActions,
  [ChainId.OPBNB_MAINNET]: opBnbMainnetDisabledTokenActions,
  [ChainId.OPBNB_TESTNET]: opBnbTestnetDisabledTokenActions,
  [ChainId.ETHEREUM]: ethereumDisabledTokenActions,
  [ChainId.SEPOLIA]: sepoliaDisabledTokenActions,
  [ChainId.ARBITRUM_ONE]: arbitrumOneDisabledTokenActions,
  [ChainId.ARBITRUM_SEPOLIA]: arbitrumSepoliaDisabledTokenActions,
  [ChainId.ZKSYNC_MAINNET]: zkSyncMainnetDisabledTokenActions,
  [ChainId.ZKSYNC_SEPOLIA]: zkSyncSepoliaDisabledTokenActions,
  [ChainId.OPTIMISM_MAINNET]: optimismMainnetDisabledTokenActions,
  [ChainId.OPTIMISM_SEPOLIA]: optimismSepoliaDisabledTokenActions,
  [ChainId.BASE_MAINNET]: baseMainnetDisabledTokenActions,
  [ChainId.BASE_SEPOLIA]: baseSepoliaDisabledTokenActions,
};

export default disabledTokenActions;
