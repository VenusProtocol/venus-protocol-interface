import isolatedPoolsArbitrumOneDeployments from '@venusprotocol/isolated-pools/deployments/arbitrumone_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vARB_Core.toLowerCase()]:
    tokenIconUrls.vArbCore,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    tokenIconUrls.vWBtcCore,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    tokenIconUrls.vWethCore,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    tokenIconUrls.vUsdcCore,

  // LS ETH
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWethLsEth,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWeEthLsEth,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWstEthLsEth,
};
