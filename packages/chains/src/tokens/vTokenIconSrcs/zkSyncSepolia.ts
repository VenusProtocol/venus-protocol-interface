import isolatedPoolsZkSyncSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/zksyncsepolia_addresses.json';
import { iconSrcs } from '../../generated/tokenIconSrcs';

import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    iconSrcs.vWBnbCore,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    iconSrcs.vWethCore,
  // has a special logo to indicate that the token is bridged to ZKsync
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    iconSrcs.vUsdcBridgedCore,
  // USDC.e shares the usual vUSDC logo
  [isolatedPoolsZkSyncSepoliaDeployments.addresses['VToken_vUSDC.e_Core'].toLowerCase()]:
    iconSrcs.vUsdcCore,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    iconSrcs.vUsdtCore,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vZK_Core.toLowerCase()]: iconSrcs.vZkCore,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vwUSDM_Core.toLowerCase()]:
    iconSrcs.vWUsdm,
};
