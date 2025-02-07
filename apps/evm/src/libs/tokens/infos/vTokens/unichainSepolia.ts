import vCbBtcCoreLogo from 'libs/tokens/img/vTokens/vCbBtcCore.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
import vWethCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';

import isolatedPoolsUnichainSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/unichainsepolia_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]:
    vWethCoreLogo,
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]:
    vUsdcCoreLogo,
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]:
    vUsdtCoreLogo,
  [isolatedPoolsUnichainSepoliaDeployments.addresses.VToken_vcbBTC_Core.toLowerCase()]:
    vCbBtcCoreLogo,
};
