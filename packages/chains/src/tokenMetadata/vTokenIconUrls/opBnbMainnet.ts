import isolatedPoolsOpBnbMainnetDeployments from '@venusprotocol/isolated-pools/deployments/opbnbmainnet_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vBTCB_Core.toLowerCase()]:
    tokenIconUrls.vBtcCore,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vETH_Core.toLowerCase()]:
    tokenIconUrls.vEthCore,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vFDUSD_Core.toLowerCase()]:
    tokenIconUrls.vFDUsdCore,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    tokenIconUrls.vUsdtCore,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vWBNB_Core.toLowerCase()]:
    tokenIconUrls.vWBnbCore,
};
