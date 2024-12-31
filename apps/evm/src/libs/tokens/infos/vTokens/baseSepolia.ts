import vCbBtcCoreLogo from 'libs/tokens/img/vTokens/vCbBtcCore.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vWethCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';

import isolatedPoolsBaseSepoliaDeployments from '@venusprotocol/isolated-pools/deployments/basesepolia_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsBaseSepoliaDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: vWethCoreLogo,
  [isolatedPoolsBaseSepoliaDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]: vUsdcCoreLogo,
  [isolatedPoolsBaseSepoliaDeployments.addresses.VToken_vcbBTC_Core.toLowerCase()]: vCbBtcCoreLogo,
};
