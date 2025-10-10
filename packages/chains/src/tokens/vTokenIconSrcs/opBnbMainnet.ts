import isolatedPoolsOpBnbMainnetDeployments from '@venusprotocol/isolated-pools/deployments/opbnbmainnet_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vBTCB_Core.toLowerCase()]:
    iconSrcs.vBtcCore,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vETH_Core.toLowerCase()]:
    iconSrcs.vEthCore,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vFDUSD_Core.toLowerCase()]:
    iconSrcs.vFDUsdCore,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    iconSrcs.vUsdtCore,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vWBNB_Core.toLowerCase()]:
    iconSrcs.vWBnbCore,
};
