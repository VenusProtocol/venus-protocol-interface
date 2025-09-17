import isolatedPoolsOpBnbTestnetDeployments from '@venusprotocol/isolated-pools/deployments/opbnbtestnet_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vBTCB_Core.toLowerCase()]:
    tokenIconUrls.vBtcCore,
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vETH_Core.toLowerCase()]:
    tokenIconUrls.vEthCore,
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    tokenIconUrls.vUsdtCore,
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vWBNB_Core.toLowerCase()]:
    tokenIconUrls.vWBnbCore,
};
