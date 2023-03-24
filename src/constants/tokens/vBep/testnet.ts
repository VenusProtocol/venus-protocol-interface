import { VToken } from 'types';

import vAave from 'assets/img/tokens/vAave.svg';
import vAda from 'assets/img/tokens/vAda.svg';
import vBnb from 'assets/img/tokens/vBnb.svg';
import vBtcb from 'assets/img/tokens/vBtcb.svg';
import vBusd from 'assets/img/tokens/vBusd.svg';
import vCake from 'assets/img/tokens/vCake.svg';
import vDoge from 'assets/img/tokens/vDoge.svg';
import vEth from 'assets/img/tokens/vEth.svg';
import vLtc from 'assets/img/tokens/vLtc.svg';
import vLuna from 'assets/img/tokens/vLuna.svg';
import vMatic from 'assets/img/tokens/vMatic.svg';
import vSxp from 'assets/img/tokens/vSxp.svg';
import vTrx from 'assets/img/tokens/vTrx.svg';
import vTusd from 'assets/img/tokens/vTusd.svg';
import vUsdc from 'assets/img/tokens/vUsdc.svg';
import vUsdt from 'assets/img/tokens/vUsdt.svg';
import vUst from 'assets/img/tokens/vUst.svg';
import vXrp from 'assets/img/tokens/vXrp.svg';
import vXvs from 'assets/img/tokens/vXvs.svg';

import { TESTNET_TOKENS } from '../common/testnet';

export const TESTNET_VBEP_TOKENS = {
  // Main pool
  '0x74469281310195a04840daf6edf576f559a3de80': {
    address: '0x74469281310195A04840Daf6EdF576F559a3dE80',
    decimals: 8,
    symbol: 'vSXP',
    asset: vSxp,
    underlyingToken: TESTNET_TOKENS.sxp,
  } as VToken,
  '0xd5c4c2e2facbeb59d0216d0595d63fcdc6f9a1a7': {
    address: '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
    decimals: 8,
    symbol: 'vUSDC',
    asset: vUsdc,
    underlyingToken: TESTNET_TOKENS.usdc,
  } as VToken,
  '0xb7526572ffe56ab9d7489838bf2e18e3323b441a': {
    address: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
    decimals: 8,
    symbol: 'vUSDT',
    asset: vUsdt,
    underlyingToken: TESTNET_TOKENS.usdt,
  } as VToken,
  '0x08e0a5575de71037ae36abfafb516595fe68e5e4': {
    address: '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    decimals: 8,
    symbol: 'vBUSD',
    asset: vBusd,
    underlyingToken: TESTNET_TOKENS.busd,
  } as VToken,
  '0x2e7222e51c0f6e98610a1543aa3836e092cde62c': {
    address: '0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c',
    decimals: 8,
    symbol: 'vBNB',
    asset: vBnb,
    underlyingToken: TESTNET_TOKENS.bnb,
  } as VToken,
  '0x6d6f697e34145bb95c54e77482d97cc261dc237e': {
    address: '0x6d6F697e34145Bb95c54E77482d97cc261Dc237E',
    decimals: 8,
    symbol: 'vXVS',
    asset: vXvs,
    underlyingToken: TESTNET_TOKENS.xvs,
  } as VToken,
  '0xb6e9322c49fd75a367fcb17b0fcd62c5070ebcbe': {
    address: '0xb6e9322C49FD75a367Fcb17B0Fcd62C5070EbCBe',
    decimals: 8,
    symbol: 'vBTCB',
    asset: vBtcb,
    underlyingToken: TESTNET_TOKENS.btcb,
  } as VToken,
  '0x162d005f0fff510e54958cfc5cf32a3180a84aab': {
    address: '0x162D005F0Fff510E54958Cfc5CF32A3180A84aab',
    decimals: 8,
    symbol: 'vETH',
    asset: vEth,
    underlyingToken: TESTNET_TOKENS.eth,
  } as VToken,
  '0xafc13bc065abee838540823431055d2ea52eba52': {
    address: '0xAfc13BC065ABeE838540823431055D2ea52eBA52',
    decimals: 8,
    symbol: 'vLTC',
    asset: vLtc,
    underlyingToken: TESTNET_TOKENS.ltc,
  } as VToken,
  '0x488ab2826a154da01cc4cc16a8c83d4720d3ca2c': {
    address: '0x488aB2826a154da01CC4CC16A8C83d4720D3cA2C',
    decimals: 8,
    symbol: 'vXRP',
    asset: vXrp,
    underlyingToken: TESTNET_TOKENS.xrp,
  } as VToken,
  '0x37c28de42ba3d22217995d146fc684b2326ede64': {
    address: '0x37C28DE42bA3d22217995D146FC684B2326Ede64',
    decimals: 8,
    symbol: 'vADA',
    asset: vAda,
    underlyingToken: TESTNET_TOKENS.ada,
  } as VToken,
  '0xf912d3001caf6dc4add366a62cc9115b4303c9a9': {
    address: '0xF912d3001CAf6DC4ADD366A62Cc9115B4303c9A9',
    decimals: 8,
    symbol: 'vDOGE',
    asset: vDoge,
    underlyingToken: TESTNET_TOKENS.doge,
  } as VToken,
  '0x3619bddc61189f33365cc572df3a68fb3b316516': {
    address: '0x3619bdDc61189F33365CC572DF3a68FB3b316516',
    decimals: 8,
    symbol: 'vMATIC',
    asset: vMatic,
    underlyingToken: TESTNET_TOKENS.matic,
  } as VToken,
  '0xedac03d29ff74b5fdc0cc936f6288312e1459bc6': {
    address: '0xeDaC03D29ff74b5fDc0CC936F6288312e1459BC6',
    decimals: 8,
    symbol: 'vCAKE',
    asset: vCake,
    underlyingToken: TESTNET_TOKENS.cake,
  } as VToken,
  '0x714db6c38a17883964b68a07d56ce331501d9eb6': {
    address: '0x714db6c38A17883964B68a07d56cE331501d9eb6',
    decimals: 8,
    symbol: 'vAAVE',
    asset: vAave,
    underlyingToken: TESTNET_TOKENS.aave,
  } as VToken,
  '0x3a00d9b02781f47d033bad62edc55fbf8d083fb0': {
    address: '0x3A00d9B02781f47d033BAd62edc55fBF8D083Fb0',
    decimals: 8,
    symbol: 'vTUSD',
    asset: vTusd,
    underlyingToken: TESTNET_TOKENS.tusd,
  } as VToken,
  '0x6af3fdb3282c5bb6926269db10837fa8aec67c04': {
    address: '0x6AF3Fdb3282c5bb6926269Db10837fa8Aec67C04',
    decimals: 8,
    symbol: 'vTRX',
    asset: vTrx,
    underlyingToken: TESTNET_TOKENS.trx,
  } as VToken,
  '0x369fea97f6fb7510755dca389088d9e2e2819278': {
    address: '0x369Fea97f6fB7510755DCA389088d9E2e2819278',
    decimals: 8,
    symbol: 'vTRXOLD',
    asset: vTrx,
    underlyingToken: TESTNET_TOKENS.trxold,
  } as VToken,
  '0xf206af85bc2761c4f876d27bd474681cfb335efa': {
    address: '0xF206af85BC2761c4F876d27Bd474681CfB335EfA',
    decimals: 8,
    symbol: 'vUST',
    asset: vUst,
    underlyingToken: TESTNET_TOKENS.ust,
  } as VToken,
  '0x9c3015191d39cf1930f92eb7e7bcbd020bca286a': {
    address: '0x9C3015191d39cF1930F92EB7e7BCbd020bCA286a',
    decimals: 8,
    symbol: 'vLUNA',
    asset: vLuna,
    underlyingToken: TESTNET_TOKENS.luna,
  } as VToken,
  // Isolated assets
  '0xe2002f16496faec6ec3d032c4c4fb924e5e7e2fa': {
    address: '0xE2002F16496faec6ec3d032c4c4fB924E5E7e2fa',
    decimals: 8,
    symbol: 'vBNX',
    asset: vXvs, // TODO: add correct asset
    underlyingToken: TESTNET_TOKENS.bnx,
  } as VToken,
  '0xe33a97a3b2a03aa064f3a83a322aaa4ed20e3c33': {
    address: '0xE33A97a3b2a03aA064F3A83A322aaA4eD20e3c33',
    decimals: 8,
    symbol: 'vBTCB',
    asset: vXvs, // TODO: add correct asset
    underlyingToken: TESTNET_TOKENS.btcb,
  } as VToken,
  '0x8bd9c7e9ff20ce9bb0a57d63aff1058116fba199': {
    address: '0x8bd9C7E9Ff20ce9bb0a57D63Aff1058116fba199',
    decimals: 8,
    symbol: 'vANKR',
    asset: vXvs, // TODO: add correct asset
    underlyingToken: TESTNET_TOKENS.ankr,
  } as VToken,
  '0xc8e2d418dae56dcc9fa05a1c67afed876f04e553': {
    address: '0xC8E2d418dAE56DcC9fa05A1c67AfeD876F04e553',
    decimals: 8,
    symbol: 'vAnkrBNB',
    asset: vXvs, // TODO: add correct asset
    underlyingToken: TESTNET_TOKENS.ankrbnb,
  } as VToken,
  '0x81f71fa6ebf7393501a0a9fe851742ff4990549e': {
    address: '0x81F71fa6eBf7393501A0a9fE851742Ff4990549e',
    decimals: 8,
    symbol: 'vMOBX',
    asset: vXvs, // TODO: add correct asset
    underlyingToken: TESTNET_TOKENS.mobx,
  } as VToken,
  '0xbe516d022b9214416d7b5b4e38977c1d80a27f61': {
    address: '0xbe516d022b9214416D7B5B4e38977C1d80A27f61',
    decimals: 8,
    symbol: 'vNFT',
    asset: vXvs, // TODO: add correct asset
    underlyingToken: TESTNET_TOKENS.nft,
  } as VToken,
  '0x67020f61f4f9ec23542cdb9d14bad0768190c4ce': {
    address: '0x67020F61F4F9ec23542cdB9d14bAd0768190c4ce',
    decimals: 8,
    symbol: 'vRACA',
    asset: vXvs, // TODO: add correct asset
    underlyingToken: TESTNET_TOKENS.raca,
  } as VToken,
  '0x16689d4153d2d234d0c17ce671fb61848078a0db': {
    address: '0x16689D4153D2d234D0c17cE671Fb61848078a0dB',
    decimals: 8,
    symbol: 'vStkBNB',
    asset: vXvs, // TODO: add correct asset
    underlyingToken: TESTNET_TOKENS.stkbnb,
  } as VToken,
  '0xc435541466890d74ed7c7102d434162817712217': {
    address: '0xC435541466890d74Ed7c7102D434162817712217',
    decimals: 8,
    symbol: 'vUSDD',
    asset: vXvs, // TODO: add correct asset
    underlyingToken: TESTNET_TOKENS.usdd,
  } as VToken,
};
