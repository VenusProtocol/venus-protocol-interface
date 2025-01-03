import vArbCoreLogo from 'libs/tokens/img/vTokens/vArbLsEth.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
import vWBtcCoreLogo from 'libs/tokens/img/vTokens/vWBtcCore.svg';
import vWEthCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';

import vWeEthLsEthLogo from 'libs/tokens/img/vTokens/vWeEthLsEth.svg';
import vWethLsEthLogo from 'libs/tokens/img/vTokens/vWethLsEth.svg';
import vWstEthLsEthLogo from 'libs/tokens/img/vTokens/vWstEthLsEth.svg';

import isolatedPoolsArbitrumSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/arbitrumsepolia_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vARB_Core.toLowerCase()]: vArbCoreLogo,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    vWBtcCoreLogo,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    vWEthCoreLogo,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    vUsdcCoreLogo,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    vUsdtCoreLogo,

  // LS ETH
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    vWethLsEthLogo,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    vWeEthLsEthLogo,
  [isolatedPoolsArbitrumSepoliaDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    vWstEthLsEthLogo,
};
