import isolatedPoolsBaseDeployments from '@venusprotocol/isolated-pools/deployments/basemainnet_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsBaseDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: tokenIconUrls.vWethCore,
  [isolatedPoolsBaseDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]: tokenIconUrls.vUsdcCore,
  [isolatedPoolsBaseDeployments.addresses.VToken_vcbBTC_Core.toLowerCase()]:
    tokenIconUrls.vCbBtcCore,
};
