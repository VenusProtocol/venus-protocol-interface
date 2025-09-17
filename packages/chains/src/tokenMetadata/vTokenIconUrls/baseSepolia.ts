import isolatedPoolsBaseSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/basesepolia_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsBaseSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    tokenIconUrls.vWethCore,
  [isolatedPoolsBaseSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    tokenIconUrls.vUsdcCore,
  [isolatedPoolsBaseSepoliaDeployments.addresses.VToken_vcbBTC_Core.toLowerCase()]:
    tokenIconUrls.vCbBtcCore,
};
