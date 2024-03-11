import { ChainId } from 'types';

import type { DisabledTokenActionMapping } from '../../types';
import { disabledTokenActions as bscMainnetDisabledTokenActions } from './bscMainnet';
import { disabledTokenActions as bscTestnetDisabledTokenActions } from './bscTestnet';
import { disabledTokenActions as ethereumDisabledTokenActions } from './ethereum';
import { disabledTokenActions as opBnbMainnetDisabledTokenActions } from './opBnbMainnet';
import { disabledTokenActions as opBnbTestnetDisabledTokenActions } from './opBnbTestnet';
import { disabledTokenActions as sepoliaDisabledTokenActions } from './sepolia';

const disabledTokenActions: DisabledTokenActionMapping = {
  [ChainId.BSC_MAINNET]: bscMainnetDisabledTokenActions,
  [ChainId.BSC_TESTNET]: bscTestnetDisabledTokenActions,
  [ChainId.OPBNB_MAINNET]: opBnbMainnetDisabledTokenActions,
  [ChainId.OPBNB_TESTNET]: opBnbTestnetDisabledTokenActions,
  [ChainId.ETHEREUM]: ethereumDisabledTokenActions,
  [ChainId.SEPOLIA]: sepoliaDisabledTokenActions,
};

export default disabledTokenActions;
