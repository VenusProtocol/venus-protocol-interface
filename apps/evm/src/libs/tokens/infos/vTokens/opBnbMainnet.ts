import vBtcCoreLogo from 'libs/tokens/img/vTokens/vBtcCore.svg';
import vEthCoreLogo from 'libs/tokens/img/vTokens/vEthCore.svg';
import vFDUsdCoreLogo from 'libs/tokens/img/vTokens/vFDUsdCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
// import vWBnbCoreLogo from 'libs/tokens/img/vTokens/vWBnbCore.svg';

import isolatedPoolsOpBnbMainnetDeployments from '@venusprotocol/isolated-pools/deployments/opbnbmainnet_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vBTCB_Core]: vBtcCoreLogo,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vETH_Core]: vEthCoreLogo,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vFDUSD_Core]: vFDUsdCoreLogo,
  [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vUSDT_Core]: vUsdtCoreLogo,
  // [isolatedPoolsOpBnbMainnetDeployments.addresses.VToken_vWBNB_Core]: vWBnbCoreLogo,
};
