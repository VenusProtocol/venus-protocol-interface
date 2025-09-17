import isolatedPoolsArbitrumSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/arbitrumsepolia_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vARB_Core.toLowerCase()]:
    tokenIconUrls.vArbCore,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    tokenIconUrls.vWBtcCore,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    tokenIconUrls.vWethCore,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    tokenIconUrls.vUsdcCore,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    tokenIconUrls.vUsdtCore,

  // LS ETH
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWethLsEth,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWeEthLsEth,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWstEthLsEth,
};
