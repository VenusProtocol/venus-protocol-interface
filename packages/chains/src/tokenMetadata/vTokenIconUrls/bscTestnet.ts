import isolatedPoolsBscTestnetDeployments from '@venusprotocol/isolated-pools/deployments/bsctestnet_addresses.json';
import venusProtocolBscTestnetDeployments from '@venusprotocol/venus-protocol/deployments/bsctestnet_addresses.json';

import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { VTokenIconUrlMapping } from '../../types';

export const vTokenIconUrls: VTokenIconUrlMapping = {
  // Core pool
  [venusProtocolBscTestnetDeployments.addresses.vBNB.toLowerCase()]: tokenIconUrls.vBnbCore,
  [venusProtocolBscTestnetDeployments.addresses.vBTCB.toLowerCase()]: tokenIconUrls.vBtcCore,
  [venusProtocolBscTestnetDeployments.addresses.vBUSD.toLowerCase()]: tokenIconUrls.vBusdCore,
  [venusProtocolBscTestnetDeployments.addresses.vETH.toLowerCase()]: tokenIconUrls.vEthCore,
  [venusProtocolBscTestnetDeployments.addresses.vFDUSD.toLowerCase()]: tokenIconUrls.vFDUsdCore,
  [venusProtocolBscTestnetDeployments.addresses.vLTC.toLowerCase()]: tokenIconUrls.vLtcCore,
  [venusProtocolBscTestnetDeployments.addresses.vSXP.toLowerCase()]: tokenIconUrls.vSxpCore,
  [venusProtocolBscTestnetDeployments.addresses.vTRX.toLowerCase()]: tokenIconUrls.vTrxCore,
  [venusProtocolBscTestnetDeployments.addresses.vTUSD.toLowerCase()]: tokenIconUrls.vTusdCore,
  [venusProtocolBscTestnetDeployments.addresses.vUSDC.toLowerCase()]: tokenIconUrls.vUsdcCore,
  [venusProtocolBscTestnetDeployments.addresses.vUSDT.toLowerCase()]: tokenIconUrls.vUsdtCore,
  [venusProtocolBscTestnetDeployments.addresses.vWBETH.toLowerCase()]: tokenIconUrls.vWBethCore,
  [venusProtocolBscTestnetDeployments.addresses.vXRP.toLowerCase()]: tokenIconUrls.vXrpCore,
  [venusProtocolBscTestnetDeployments.addresses.vXVS.toLowerCase()]: tokenIconUrls.vXvsCore,
  // Defi pool
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vALPACA_DeFi.toLowerCase()]:
    tokenIconUrls.vAlpacaDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vANKR_DeFi.toLowerCase()]:
    tokenIconUrls.vAnkrDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vankrBNB_DeFi.toLowerCase()]:
    tokenIconUrls.vAnkrBnbDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBSW_DeFi.toLowerCase()]:
    tokenIconUrls.vBswDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vPLANET_DeFi.toLowerCase()]:
    tokenIconUrls.vPlanetDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vTWT_DeFi.toLowerCase()]:
    tokenIconUrls.vTwtDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDD_DeFi.toLowerCase()]:
    tokenIconUrls.vUsddDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_DeFi.toLowerCase()]:
    tokenIconUrls.vUsdtDefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vEURA_Stablecoins.toLowerCase()]:
    tokenIconUrls.vEuraStablecoins,
  // Meme
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBabyDoge_Meme.toLowerCase()]:
    tokenIconUrls.vBabyDogeMeme,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_Meme.toLowerCase()]:
    tokenIconUrls.vUsdtMeme,
  // Gamefi
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vFLOKI_GameFi.toLowerCase()]:
    tokenIconUrls.vFlokiGamefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vRACA_GameFi.toLowerCase()]:
    tokenIconUrls.vRacaGamefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDD_GameFi.toLowerCase()]:
    tokenIconUrls.vUsddGamefi,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_GameFi.toLowerCase()]:
    tokenIconUrls.vUsdtGamefi,
  // Liquid Staked BNB
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vankrBNB_LiquidStakedBNB.toLowerCase()]:
    tokenIconUrls.vAnkrBnbLsBnb,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBNBx_LiquidStakedBNB.toLowerCase()]:
    tokenIconUrls.vBnbXLsBnb,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vslisBNB_LiquidStakedBNB.toLowerCase()]:
    tokenIconUrls.vSlisBnbLsBnb,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vstkBNB_LiquidStakedBNB.toLowerCase()]:
    tokenIconUrls.vStkBnbLsBnb,

  // Liquid Staked ETH
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vEthLsEth,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vweETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWeEthLsEth,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vwstETH_LiquidStakedETH.toLowerCase()]:
    tokenIconUrls.vWstEthLsEth,

  // Tron
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vBTT_Tron.toLowerCase()]:
    tokenIconUrls.vBttTron,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vTRX_Tron.toLowerCase()]:
    tokenIconUrls.vTrxTron,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDD_Tron.toLowerCase()]:
    tokenIconUrls.vUsddTron,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vUSDT_Tron.toLowerCase()]:
    tokenIconUrls.vUsdtTron,
  [isolatedPoolsBscTestnetDeployments.addresses.VToken_vWIN_Tron.toLowerCase()]:
    tokenIconUrls.vWinTron,
};
