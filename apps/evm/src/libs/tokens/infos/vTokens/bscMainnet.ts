import vAaveCoreLogo from 'libs/tokens/img/vTokens/vAaveCore.svg';
import vAdaCoreLogo from 'libs/tokens/img/vTokens/vAdaCore.svg';
import vBchCoreLogo from 'libs/tokens/img/vTokens/vBchCore.svg';
import vBethCoreLogo from 'libs/tokens/img/vTokens/vBethCore.svg';
import vBnbCoreLogo from 'libs/tokens/img/vTokens/vBnbCore.svg';
import vBtcCoreLogo from 'libs/tokens/img/vTokens/vBtcCore.svg';
import vBusdCoreLogo from 'libs/tokens/img/vTokens/vBusdCore.svg';
import vCakeCoreLogo from 'libs/tokens/img/vTokens/vCakeCore.svg';
import vDaiCoreLogo from 'libs/tokens/img/vTokens/vDaiCore.svg';
import vDogeCoreLogo from 'libs/tokens/img/vTokens/vDogeCore.svg';
import vDotCoreLogo from 'libs/tokens/img/vTokens/vDotCore.svg';
import vEthCoreLogo from 'libs/tokens/img/vTokens/vEthCore.svg';
import vFDUsdCoreLogo from 'libs/tokens/img/vTokens/vFDUsdCore.svg';
import vFilCoreLogo from 'libs/tokens/img/vTokens/vFilCore.svg';
import vLinkCoreLogo from 'libs/tokens/img/vTokens/vLinkCore.svg';
import vLtcCoreLogo from 'libs/tokens/img/vTokens/vLtcCore.svg';
import vLunaCoreLogo from 'libs/tokens/img/vTokens/vLunaCore.svg';
import vMaticCoreLogo from 'libs/tokens/img/vTokens/vMaticCore.svg';
import vSxpCoreLogo from 'libs/tokens/img/vTokens/vSxpCore.svg';
import vTrxCoreLogo from 'libs/tokens/img/vTokens/vTrxCore.svg';
import vTusdCoreLogo from 'libs/tokens/img/vTokens/vTusdCore.svg';
import vUsdcCoreLogo from 'libs/tokens/img/vTokens/vUsdcCore.svg';
import vUsdtCoreLogo from 'libs/tokens/img/vTokens/vUsdtCore.svg';
import vUstCoreLogo from 'libs/tokens/img/vTokens/vUstCore.svg';
import vWBethCoreLogo from 'libs/tokens/img/vTokens/vWBethCore.svg';
import vXvsCoreLogo from 'libs/tokens/img/vTokens/vXvsCore.svg';
import vXrpCoreLogo from 'libs/tokens/img/vTokens/xXrpCore.svg';

// Defi
import vAlpacaDefiLogo from 'libs/tokens/img/vTokens/vAlpacaDefi.svg';
import vAnkrBnbDefiLogo from 'libs/tokens/img/vTokens/vAnkrBnbDefi.svg';
import vAnkrDefiLogo from 'libs/tokens/img/vTokens/vAnkrDefi.svg';
import vBswDefiLogo from 'libs/tokens/img/vTokens/vBswDefi.svg';
import vPlanetDefiLogo from 'libs/tokens/img/vTokens/vPlanetDefi.svg';
import vTwtDefiLogo from 'libs/tokens/img/vTokens/vTwtDefi.svg';
import vUsddDefiLogo from 'libs/tokens/img/vTokens/vUsddDefi.svg';
import vUsdtDefiLogo from 'libs/tokens/img/vTokens/vUsdtDefi.svg';

// Stablecoins
import vEuraStablecoinsLogo from 'libs/tokens/img/vTokens/vEuraStablecoins.svg';
import vUsddStablecoinsLogo from 'libs/tokens/img/vTokens/vUsddStablecoins.svg';
import vUsdtStablecoinsLogo from 'libs/tokens/img/vTokens/vUsdtStablecoins.svg';

// Meme
import vBabyDogeMemeLogo from 'libs/tokens/img/vTokens/vBabyDogeMeme.svg';
import vUsdtMemeLogo from 'libs/tokens/img/vTokens/vUsdtMeme.svg';

// Gamefi
import vFlokiGamefiLogo from 'libs/tokens/img/vTokens/vFlokiGamefi.svg';
import vRacaGamefiLogo from 'libs/tokens/img/vTokens/vRacaGamefi.svg';
import vUsddGamefiLogo from 'libs/tokens/img/vTokens/vUsddGamefi.svg';
import vUsdtGamefiLogo from 'libs/tokens/img/vTokens/vUsdtGamefi.svg';

// LS BNB
import vAnkrBnbLsBnbLogo from 'libs/tokens/img/vTokens/vAnkrBnbLsBnb.svg';
import vBnbXLsBnbLogo from 'libs/tokens/img/vTokens/vBnbXLsBnb.svg';
import vSlisBnbLsBnbLogo from 'libs/tokens/img/vTokens/vSlisBnbLsBnb.svg';
import vStkBnbLsBnbLogo from 'libs/tokens/img/vTokens/vStkBnbLsBnb.svg';

// LS ETH
import vEthLsEthLogo from 'libs/tokens/img/vTokens/vEthLsEth.svg';
import vWEthLsEthLogo from 'libs/tokens/img/vTokens/vWethLsEth.svg';
import vWstEthLsEthLogo from 'libs/tokens/img/vTokens/vWstEthLsEth.svg';

// Tron
import vBttTronLogo from 'libs/tokens/img/vTokens/vBttTron.svg';
import vTrxTronLogo from 'libs/tokens/img/vTokens/vTrxTron.svg';
import vUsddTronLogo from 'libs/tokens/img/vTokens/vUsddTron.svg';
import vUsdtTronLogo from 'libs/tokens/img/vTokens/vUsdtTron.svg';
import vWinTronLogo from 'libs/tokens/img/vTokens/vWinTron.svg';

import isolatedPoolsBscMainnetDeployments from '@venusprotocol/isolated-pools/deployments/bscmainnet_addresses.json';
import venusProtocolBscMainnetDeployments from '@venusprotocol/venus-protocol/deployments/bscmainnet_addresses.json';

import type { VTokenAssets } from 'libs/tokens/types';

export const vTokenAssets: VTokenAssets = {
  // Core pool
  [venusProtocolBscMainnetDeployments.addresses.vAAVE]: vAaveCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vADA]: vAdaCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vBCH]: vBchCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vBETH]: vBethCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vBNB]: vBnbCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vBTC]: vBtcCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vBUSD]: vBusdCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vCAKE]: vCakeCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vDAI]: vDaiCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vDOGE]: vDogeCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vDOT]: vDotCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vETH]: vEthCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vFDUSD]: vFDUsdCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vFIL]: vFilCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vLINK]: vLinkCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vLTC]: vLtcCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vLUNA]: vLunaCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vMATIC]: vMaticCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vSXP]: vSxpCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vTRX]: vTrxCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vTRXOLD]: vTrxCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vTUSD]: vTusdCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vTUSDOLD]: vTusdCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vUSDC]: vUsdcCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vUSDT]: vUsdtCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vUST]: vUstCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vWBETH]: vWBethCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vXRP]: vXrpCoreLogo,
  [venusProtocolBscMainnetDeployments.addresses.vXVS]: vXvsCoreLogo,
  // Defi pool
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vALPACA_DeFi]: vAlpacaDefiLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vANKR_DeFi]: vAnkrDefiLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vankrBNB_DeFi]: vAnkrBnbDefiLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBSW_DeFi]: vBswDefiLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vPLANET_DeFi]: vPlanetDefiLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vTWT_DeFi]: vTwtDefiLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_DeFi]: vUsddDefiLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_DeFi]: vUsdtDefiLogo,
  // Stablecoins
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_Stablecoins]: vUsddStablecoinsLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_Stablecoins]: vUsdtStablecoinsLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vagEUR_Stablecoins]: vEuraStablecoinsLogo,
  // Meme
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBabyDoge_Meme]: vBabyDogeMemeLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_Meme]: vUsdtMemeLogo,
  // Gamefi
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vFLOKI_GameFi]: vFlokiGamefiLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vRACA_GameFi]: vRacaGamefiLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_GameFi]: vUsddGamefiLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_GameFi]: vUsdtGamefiLogo,
  // Liquid Staked BNB
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vankrBNB_LiquidStakedBNB]: vAnkrBnbLsBnbLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBNBx_LiquidStakedBNB]: vBnbXLsBnbLogo,
  // slisBNB package name is wrong
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vSnBNB_LiquidStakedBNB]: vSlisBnbLsBnbLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vstkBNB_LiquidStakedBNB]: vStkBnbLsBnbLogo,

  // Liquid Staked ETH
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vETH_LiquidStakedETH]: vEthLsEthLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vweETH_LiquidStakedETH]: vWEthLsEthLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vwstETH_LiquidStakedETH]: vWstEthLsEthLogo,

  // Tron
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vBTT_Tron]: vBttTronLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vTRX_Tron]: vTrxTronLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDD_Tron]: vUsddTronLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vUSDT_Tron]: vUsdtTronLogo,
  [isolatedPoolsBscMainnetDeployments.addresses.VToken_vWIN_Tron]: vWinTronLogo,
};
