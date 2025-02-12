import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vWethCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';

import isolatedPoolsUnichainMainnetDeployments from '@venusprotocol/isolated-pools/deployments/unichainmainnet_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsUnichainMainnetDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    vWethCoreLogo,
  [isolatedPoolsUnichainMainnetDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    vUsdcCoreLogo,
};
