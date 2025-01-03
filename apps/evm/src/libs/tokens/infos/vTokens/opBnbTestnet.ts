import vBtcCoreLogo from 'libs/tokens/img/vTokens/vBtcCore.svg';
import vEthCoreLogo from 'libs/tokens/img/vTokens/vEthCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
import vWBnbCoreLogo from 'libs/tokens/img/vTokens/vWBnbCore.svg';

import isolatedPoolsOpBnbTestnetDeployments from '@venusprotocol/isolated-pools/deployments/opbnbtestnet_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vBTCB_Core.toLowerCase()]: vBtcCoreLogo,
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vETH_Core.toLowerCase()]: vEthCoreLogo,
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]: vUsdtCoreLogo,
  [isolatedPoolsOpBnbTestnetDeployments.addresses.VToken_vWBNB_Core.toLowerCase()]: vWBnbCoreLogo,
};
