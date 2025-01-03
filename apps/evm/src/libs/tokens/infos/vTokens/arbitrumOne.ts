import vArbCoreLogo from 'libs/tokens/img/vTokens/vArbLsEth.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
import vWBtcCoreLogo from 'libs/tokens/img/vTokens/vWBtcCore.svg';
import vWEthCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';

import vWeEthLsEthLogo from 'libs/tokens/img/vTokens/vWeEthLsEth.svg';
import vWethLsEthLogo from 'libs/tokens/img/vTokens/vWethLsEth.svg';
import vWstEthLsEthLogo from 'libs/tokens/img/vTokens/vWstEthLsEth.svg';

import isolatedPoolsArbitrumOneDeployments from '@venusprotocol/isolated-pools/deployments/arbitrumone_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vARB_Core.toLowerCase()]: vArbCoreLogo,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]: vWBtcCoreLogo,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: vWEthCoreLogo,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]: vUsdcCoreLogo,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]: vUsdtCoreLogo,

  // LS ETH
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vWETH_LiquidStakedETH.toLowerCase()]:
    vWethLsEthLogo,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    vWeEthLsEthLogo,
  [isolatedPoolsArbitrumOneDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    vWstEthLsEthLogo,
};
