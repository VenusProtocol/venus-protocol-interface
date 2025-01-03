import vOpCoreLogo from 'libs/tokens/img/vTokens/vOpCore.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
import vWBnbCoreLogo from 'libs/tokens/img/vTokens/vWBtcCore.svg';
import vWEthCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';

import isolatedPoolsOptimismSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/opsepolia_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vOP_Core.toLowerCase()]: vOpCoreLogo,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]:
    vWBnbCoreLogo,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    vWEthCoreLogo,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    vUsdcCoreLogo,
  [isolatedPoolsOptimismSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    vUsdtCoreLogo,
};
