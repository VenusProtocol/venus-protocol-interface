import vCbBtcCoreLogo from 'libs/tokens/img/vTokens/vCbBtcCore.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vWethCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';

import isolatedPoolsBaseDeployments from '@venusprotocol/isolated-pools/deployments/basemainnet_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsBaseDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: vWethCoreLogo,
  [isolatedPoolsBaseDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]: vUsdcCoreLogo,
  [isolatedPoolsBaseDeployments.addresses.VToken_vcbBTC_Core.toLowerCase()]: vCbBtcCoreLogo,
};
