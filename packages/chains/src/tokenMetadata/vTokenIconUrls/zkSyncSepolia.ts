import isolatedPoolsZkSyncSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/zksyncsepolia_addresses.json';
import tokenIconUrls from '../../generated/tokenIconUrls.json';

import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    tokenIconUrls.vWBnbCore,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    tokenIconUrls.vWethCore,
  // has a special logo to indicate that the token is bridged to ZKsync
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    tokenIconUrls.vUsdcBridgedCore,
  // USDC.e shares the usual vUSDC logo
  [isolatedPoolsZkSyncSepoliaDeployments.addresses['VToken_vUSDC.e_Core'].toLowerCase()]:
    tokenIconUrls.vUsdcCore,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    tokenIconUrls.vUsdtCore,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vZK_Core.toLowerCase()]:
    tokenIconUrls.vZkCore,
  [isolatedPoolsZkSyncSepoliaDeployments.addresses.VToken_vwUSDM_Core.toLowerCase()]:
    tokenIconUrls.vWUsdm,
};
