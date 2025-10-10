import isolatedPoolsBscTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet_addresses.json';
import venusProtocolBscTestnetDeployments from '@venusprotocol/venus-protocol/deployments/bsctestnet_addresses.json';

import { iconSrcs } from '../../generated/tokenIconSrcs';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconSrcs: VTokenIconUrlMapping = {
  // Core pool
  [venusProtocolBscTestnetDeployments.addresses.vBNB.toLowerCase()]: iconSrcs.vBnbCore,
  [venusProtocolBscTestnetDeployments.addresses.vBTCB.toLowerCase()]: iconSrcs.vBtcCore,
  [venusProtocolBscTestnetDeployments.addresses.vBUSD.toLowerCase()]: iconSrcs.vBusdCore,
  [venusProtocolBscTestnetDeployments.addresses.vETH.toLowerCase()]: iconSrcs.vEthCore,
  [venusProtocolBscTestnetDeployments.addresses.vFDUSD.toLowerCase()]: iconSrcs.vFDUsdCore,
  [venusProtocolBscTestnetDeployments.addresses.vLTC.toLowerCase()]: iconSrcs.vLtcCore,
  [venusProtocolBscTestnetDeployments.addresses.vSXP.toLowerCase()]: iconSrcs.vSxpCore,
  [venusProtocolBscTestnetDeployments.addresses.vTRX.toLowerCase()]: iconSrcs.vTrxCore,
  [venusProtocolBscTestnetDeployments.addresses.vTUSD.toLowerCase()]: iconSrcs.vTusdCore,
  [venusProtocolBscTestnetDeployments.addresses.vUSDC.toLowerCase()]: iconSrcs.vUsdcCore,
  [venusProtocolBscTestnetDeployments.addresses.vUSDT.toLowerCase()]: iconSrcs.vUsdtCore,
  [venusProtocolBscTestnetDeployments.addresses.vWBETH.toLowerCase()]: iconSrcs.vWBethCore,
  [venusProtocolBscTestnetDeployments.addresses.vXRP.toLowerCase()]: iconSrcs.vXrpCore,
  [venusProtocolBscTestnetDeployments.addresses.vXVS.toLowerCase()]: iconSrcs.vXvsCore,
  // Defi pool
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vALPACA_DeFi.toLowerCase()]:
    iconSrcs.vAlpacaDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vANKR_DeFi.toLowerCase()]:
    iconSrcs.vAnkrDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vankrBNB_DeFi.toLowerCase()]:
    iconSrcs.vAnkrBnbDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBSW_DeFi.toLowerCase()]: iconSrcs.vBswDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vPLANET_DeFi.toLowerCase()]:
    iconSrcs.vPlanetDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vTWT_DeFi.toLowerCase()]: iconSrcs.vTwtDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDD_DeFi.toLowerCase()]:
    iconSrcs.vUsddDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_DeFi.toLowerCase()]:
    iconSrcs.vUsdtDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vEURA_Stablecoins.toLowerCase()]:
    iconSrcs.vEuraStablecoins,
  // Meme
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBabyDoge_Meme.toLowerCase()]:
    iconSrcs.vBabyDogeMeme,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_Meme.toLowerCase()]:
    iconSrcs.vUsdtMeme,
  // Gamefi
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vFLOKI_GameFi.toLowerCase()]:
    iconSrcs.vFlokiGamefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vRACA_GameFi.toLowerCase()]:
    iconSrcs.vRacaGamefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDD_GameFi.toLowerCase()]:
    iconSrcs.vUsddGamefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_GameFi.toLowerCase()]:
    iconSrcs.vUsdtGamefi,
  // Liquid Staked BNB
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vankrBNB_LiquidStakedBNB.toLowerCase()]:
    iconSrcs.vAnkrBnbLsBnb,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBNBx_LiquidStakedBNB.toLowerCase()]:
    iconSrcs.vBnbXLsBnb,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vslisBNB_LiquidStakedBNB.toLowerCase()]:
    iconSrcs.vSlisBnbLsBnb,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vstkBNB_LiquidStakedBNB.toLowerCase()]:
    iconSrcs.vStkBnbLsBnb,

  // Liquid Staked ETH
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vEthLsEth,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWeEthLsEth,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    iconSrcs.vWstEthLsEth,

  // Tron
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBTT_Tron.toLowerCase()]: iconSrcs.vBttTron,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vTRX_Tron.toLowerCase()]: iconSrcs.vTrxTron,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDD_Tron.toLowerCase()]:
    iconSrcs.vUsddTron,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_Tron.toLowerCase()]:
    iconSrcs.vUsdtTron,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vWIN_Tron.toLowerCase()]: iconSrcs.vWinTron,
};
