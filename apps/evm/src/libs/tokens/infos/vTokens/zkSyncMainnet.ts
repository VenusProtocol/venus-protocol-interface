import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vUsdcECoreLogo from 'libs/tokens/img/vTokens/vUsdcECore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
import vWBnbCoreLogo from 'libs/tokens/img/vTokens/vWBtcCore.svg';
import vWEthCoreLogo from 'libs/tokens/img/vTokens/vWethCore.svg';
import vZkCoreLogo from 'libs/tokens/img/vTokens/vZkCore.svg';

import isolatedPoolsZkSyncMainnetDeployments from '@venusprotocol/isolated-pools/deployments/zksyncmainnet_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vWBTC_Core.toLowerCase()]: vWBnbCoreLogo,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vWETH_Core.toLowerCase()]: vWEthCoreLogo,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vUSDC_Core.toLowerCase()]: vUsdcCoreLogo,
  [isolatedPoolsZkSyncMainnetDeployments.addresses['VToken_vUSDC.e_Core'].toLowerCase()]:
    vUsdcECoreLogo,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vUSDT_Core.toLowerCase()]: vUsdtCoreLogo,
  [isolatedPoolsZkSyncMainnetDeployments.addresses.VToken_vZK_Core.toLowerCase()]: vZkCoreLogo,
};
