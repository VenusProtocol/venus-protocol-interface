import isolatedPoolsZkSyncMainnetDeployments from '@venusprotocol/isolated-pools/deployments/zksyncmainnet_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    tokenIconUrls.vWBnbCore,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    tokenIconUrls.vWethCore,
  // has a special logo to indicate that the token is bridged to ZKsync
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    tokenIconUrls.vUsdcBridgedCore,
  // USDC.e shares the usual vUSDC logo
  [isolatedPoolsZkSyncMainnetDeployments.addresses['VToken_vUSDC.e_Core'].toLowerCase()]:
    tokenIconUrls.vUsdcCore,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    tokenIconUrls.vUsdtCore,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vZK_Core.toLowerCase()]:
    tokenIconUrls.vZkCore,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vwUSDM_Core.toLowerCase()]:
    tokenIconUrls.vWUsdm,
};
