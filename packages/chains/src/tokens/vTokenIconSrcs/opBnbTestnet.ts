import isolatedPoolsOpBnbTestnetDeployments from '@venusprotocol/isolated-pools/deployments/opbnbtestnet_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vBTCB_Core.toLowerCase()]:
    iconSrcs.vBtcCore,
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vETH_Core.toLowerCase()]:
    iconSrcs.vEthCore,
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    iconSrcs.vUsdtCore,
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vWBNB_Core.toLowerCase()]:
    iconSrcs.vWBnbCore,
};
