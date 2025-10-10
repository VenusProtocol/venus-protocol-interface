import isolatedPoolsZkSyncMainnetDeployments from '@venusprotocol/isolated-pools/deployments/zksyncmainnet_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    iconSrcs.vWBnbCore,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    iconSrcs.vWethCore,
  // has a special logo to indicate that the token is bridged to ZKsync
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    iconSrcs.vUsdcBridgedCore,
  // USDC.e shares the usual vUSDC logo
  [isolatedPoolsZkSyncMainnetDeployments.addresses['VToken_vUSDC.e_Core'].toLowerCase()]:
    iconSrcs.vUsdcCore,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    iconSrcs.vUsdtCore,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vZK_Core.toLowerCase()]: iconSrcs.vZkCore,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vwUSDM_Core.toLowerCase()]:
    iconSrcs.vWUsdm,
};
