import sxp from 'assets/img/coins/sxp.png';
import usdc from 'assets/img/coins/usdc.png';
import usdt from 'assets/img/coins/usdt.png';
import busd from 'assets/img/coins/busd.png';
import bnb from 'assets/img/coins/bnb.png';
import xvs from 'assets/img/coins/xvs.png';
import btc from 'assets/img/coins/btc.png';
import eth from 'assets/img/coins/eth.png';
import ltc from 'assets/img/coins/ltc.png';
import xrp from 'assets/img/coins/xrp.png';
import link from 'assets/img/coins/link.png';
import dot from 'assets/img/coins/dot.png';
import bch from 'assets/img/coins/bch.png';
import dai from 'assets/img/coins/dai.png';
import fil from 'assets/img/coins/fil.png';
import beth from 'assets/img/coins/beth.png';
import ada from 'assets/img/coins/ada.png';
import doge from 'assets/img/coins/doge.png';
import matic from 'assets/img/coins/matic.png';
import cake from 'assets/img/coins/cake.png';
import aave from 'assets/img/coins/aave.png';
import tusd from 'assets/img/coins/tusd.png';

import vsxp from 'assets/img/coins/vsxp.png';
import vusdc from 'assets/img/coins/vusdc.png';
import vusdt from 'assets/img/coins/vusdt.png';
import vbusd from 'assets/img/coins/vbusd.png';
import vbnb from 'assets/img/coins/vbnb.png';
import vxvs from 'assets/img/coins/vxvs.png';
import vbtc from 'assets/img/coins/vbtc.png';
import veth from 'assets/img/coins/veth.png';
import vltc from 'assets/img/coins/vltc.png';
import vxrp from 'assets/img/coins/vxrp.png';
import vlink from 'assets/img/coins/vlink.png';
import vdot from 'assets/img/coins/vdot.png';
import vbch from 'assets/img/coins/vbch.png';
import vdai from 'assets/img/coins/vdai.png';
import vfil from 'assets/img/coins/vfil.png';
import vbeth from 'assets/img/coins/vbeth.png';
import vada from 'assets/img/coins/vada.png';
import vdoge from 'assets/img/coins/vdoge.png';
import vmatic from 'assets/img/coins/vmatic.png';
import vcake from 'assets/img/coins/vcake.png';
import vaave from 'assets/img/coins/vaave.png';
import vtusd from 'assets/img/coins/vtusd.png';

import contracts from './contracts';

export const CONTRACT_XVS_TOKEN_ADDRESS =
  process.env.REACT_APP_CHAIN_ID === '97'
    ? contracts.TEST.TOKEN.xvs
    : contracts.MAIN.TOKEN.xvs;

// Contract ABI
export const CONTRACT_TOKEN_ADDRESS =
  process.env.REACT_APP_CHAIN_ID === '97'
    ? {
        sxp: {
          id: 'sxp',
          symbol: 'SXP',
          decimals: 18,
          address: contracts.TEST.TOKEN.sxp,
          asset: sxp,
          vasset: vsxp
        },
        usdc: {
          id: 'usdc',
          symbol: 'USDC',
          decimals: 6,
          address: contracts.TEST.TOKEN.usdc,
          asset: usdc,
          vasset: vusdc
        },
        usdt: {
          id: 'usdt',
          symbol: 'USDT',
          decimals: 6,
          address: contracts.TEST.TOKEN.usdt,
          asset: usdt,
          vasset: vusdt
        },
        busd: {
          id: 'busd',
          symbol: 'BUSD',
          decimals: 18,
          address: contracts.TEST.TOKEN.busd,
          asset: busd,
          vasset: vbusd
        },
        bnb: {
          id: 'bnb',
          symbol: 'BNB',
          decimals: 18,
          asset: bnb,
          vasset: vbnb
        },
        xvs: {
          id: 'xvs',
          symbol: 'XVS',
          decimals: 18,
          address: contracts.TEST.TOKEN.xvs,
          asset: xvs,
          vasset: vxvs
        },
        btcb: {
          id: 'btcb',
          symbol: 'BTCB',
          decimals: 18,
          address: contracts.TEST.TOKEN.btcb,
          asset: btc,
          vasset: vbtc
        },
        eth: {
          id: 'eth',
          symbol: 'ETH',
          decimals: 18,
          address: contracts.TEST.TOKEN.eth,
          asset: eth,
          vasset: veth
        },
        ltc: {
          id: 'ltc',
          symbol: 'LTC',
          decimals: 18,
          address: contracts.TEST.TOKEN.ltc,
          asset: ltc,
          vasset: vltc
        },
        xrp: {
          id: 'xrp',
          symbol: 'XRP',
          decimals: 18,
          address: contracts.TEST.TOKEN.xrp,
          asset: xrp,
          vasset: vxrp
        },
        ada: {
          id: 'ada',
          symbol: 'ADA',
          decimals: 18,
          address: contracts.TEST.TOKEN.ada,
          asset: ada,
          vasset: vada
        },
        doge: {
          id: 'doge',
          symbol: 'DOGE',
          decimals: 8,
          address: contracts.TEST.TOKEN.doge,
          asset: doge,
          vasset: vdoge
        },
        matic: {
          id: 'matic',
          symbol: 'MATIC',
          decimals: 18,
          address: contracts.TEST.TOKEN.matic,
          asset: matic,
          vasset: vmatic
        },
        cake: {
          id: 'cake',
          symbol: 'CAKE',
          decimals: 18,
          address: contracts.TEST.TOKEN.cake,
          asset: cake,
          vasset: vcake
        },
        aave: {
          id: 'aave',
          symbol: 'AAVE',
          decimals: 18,
          address: contracts.TEST.TOKEN.aave,
          asset: aave,
          vasset: vaave
        },
        tusd: {
          id: 'tusd',
          symbol: 'TUSD',
          decimals: 18,
          address: contracts.TEST.TOKEN.tusd,
          asset: tusd,
          vasset: vtusd
        }
      }
    : {
        sxp: {
          id: 'sxp',
          symbol: 'SXP',
          decimals: 18,
          address: contracts.MAIN.TOKEN.sxp,
          asset: sxp,
          vasset: vsxp
        },
        usdc: {
          id: 'usdc',
          symbol: 'USDC',
          decimals: 18,
          address: contracts.MAIN.TOKEN.usdc,
          asset: usdc,
          vasset: vusdc
        },
        usdt: {
          id: 'usdt',
          symbol: 'USDT',
          decimals: 18,
          address: contracts.MAIN.TOKEN.usdt,
          asset: usdt,
          vasset: vusdt
        },
        busd: {
          id: 'busd',
          symbol: 'BUSD',
          decimals: 18,
          address: contracts.MAIN.TOKEN.busd,
          asset: busd,
          vasset: vbusd
        },
        bnb: {
          id: 'bnb',
          symbol: 'BNB',
          decimals: 18,
          asset: bnb,
          vasset: vbnb
        },
        xvs: {
          id: 'xvs',
          symbol: 'XVS',
          decimals: 18,
          address: contracts.MAIN.TOKEN.xvs,
          asset: xvs,
          vasset: vxvs
        },
        btcb: {
          id: 'btcb',
          symbol: 'BTCB',
          decimals: 18,
          address: contracts.MAIN.TOKEN.btcb,
          asset: btc,
          vasset: vbtc
        },
        eth: {
          id: 'eth',
          symbol: 'ETH',
          decimals: 18,
          address: contracts.MAIN.TOKEN.eth,
          asset: eth,
          vasset: veth
        },
        ltc: {
          id: 'ltc',
          symbol: 'LTC',
          decimals: 18,
          address: contracts.MAIN.TOKEN.ltc,
          asset: ltc,
          vasset: vltc
        },
        xrp: {
          id: 'xrp',
          symbol: 'XRP',
          decimals: 18,
          address: contracts.MAIN.TOKEN.xrp,
          asset: xrp,
          vasset: vxrp
        },
        bch: {
          id: 'bch',
          symbol: 'BCH',
          decimals: 18,
          address: contracts.MAIN.TOKEN.bch,
          asset: bch,
          vasset: vbch
        },
        dot: {
          id: 'dot',
          symbol: 'DOT',
          decimals: 18,
          address: contracts.MAIN.TOKEN.dot,
          asset: dot,
          vasset: vdot
        },
        link: {
          id: 'link',
          symbol: 'LINK',
          decimals: 18,
          address: contracts.MAIN.TOKEN.link,
          asset: link,
          vasset: vlink
        },
        dai: {
          id: 'dai',
          symbol: 'DAI',
          decimals: 18,
          address: contracts.MAIN.TOKEN.dai,
          asset: dai,
          vasset: vdai
        },
        fil: {
          id: 'fil',
          symbol: 'FIL',
          decimals: 18,
          address: contracts.MAIN.TOKEN.fil,
          asset: fil,
          vasset: vfil
        },
        beth: {
          id: 'beth',
          symbol: 'BETH',
          decimals: 18,
          address: contracts.MAIN.TOKEN.beth,
          asset: beth,
          vasset: vbeth
        },
        ada: {
          id: 'ada',
          symbol: 'ADA',
          decimals: 18,
          address: contracts.MAIN.TOKEN.ada,
          asset: ada,
          vasset: vada
        },
        doge: {
          id: 'doge',
          symbol: 'DOGE',
          decimals: 8,
          address: contracts.MAIN.TOKEN.doge,
          asset: doge,
          vasset: vdoge
        },
        matic: {
          id: 'matic',
          symbol: 'MATIC',
          decimals: 18,
          address: contracts.MAIN.TOKEN.matic,
          asset: matic,
          vasset: vmatic
        },
        cake: {
          id: 'cake',
          symbol: 'Cake',
          decimals: 18,
          address: contracts.MAIN.TOKEN.cake,
          asset: cake,
          vasset: vcake
        },
        aave: {
          id: 'aave',
          symbol: 'AAVE',
          decimals: 18,
          address: contracts.MAIN.TOKEN.aave,
          asset: aave,
          vasset: vaave
        },
        tusd: {
          id: 'tusd',
          symbol: 'TUSD',
          decimals: 18,
          address: contracts.MAIN.TOKEN.tusd,
          asset: tusd,
          vasset: vtusd
        }
      };

export const CONTRACT_VBEP_ADDRESS =
  process.env.REACT_APP_CHAIN_ID === '97'
    ? {
        sxp: {
          id: 'sxp',
          symbol: 'vSXP',
          address: contracts.TEST.VBEP.sxp
        },
        usdc: {
          id: 'usdc',
          symbol: 'vUSDC',
          address: contracts.TEST.VBEP.usdc
        },
        usdt: {
          id: 'usdt',
          symbol: 'vUSDT',
          address: contracts.TEST.VBEP.usdt
        },
        busd: {
          id: 'busd',
          symbol: 'vBUSD',
          address: contracts.TEST.VBEP.busd
        },
        bnb: {
          id: 'bnb',
          symbol: 'vBNB',
          address: contracts.TEST.VBEP.bnb
        },
        xvs: {
          id: 'xvs',
          symbol: 'vXVS',
          address: contracts.TEST.VBEP.xvs
        },
        btcb: {
          id: 'btcb',
          symbol: 'vBTC',
          address: contracts.TEST.VBEP.btcb
        },
        eth: {
          id: 'eth',
          symbol: 'vETH',
          address: contracts.TEST.VBEP.eth
        },
        ltc: {
          id: 'ltc',
          symbol: 'vLTC',
          address: contracts.TEST.VBEP.ltc
        },
        xrp: {
          id: 'xrp',
          symbol: 'vXRP',
          address: contracts.TEST.VBEP.xrp
        },
        ada: {
          id: 'ada',
          symbol: 'vADA',
          address: contracts.TEST.VBEP.ada
        },
        doge: {
          id: 'doge',
          symbol: 'vDOGE',
          address: contracts.TEST.VBEP.doge
        },
        matic: {
          id: 'matic',
          symbol: 'vMATIC',
          address: contracts.TEST.VBEP.matic
        },
        cake: {
          id: 'cake',
          symbol: 'vCAKE',
          address: contracts.TEST.VBEP.cake
        },
        aave: {
          id: 'aave',
          symbol: 'vAAVE',
          address: contracts.TEST.VBEP.aave
        },
        tusd: {
          id: 'tusd',
          symbol: 'vTUSD',
          address: contracts.TEST.VBEP.tusd
        }
      }
    : {
        sxp: {
          id: 'sxp',
          symbol: 'vSXP',
          address: contracts.MAIN.VBEP.sxp
        },
        usdc: {
          id: 'usdc',
          symbol: 'vUSDC',
          address: contracts.MAIN.VBEP.usdc
        },
        usdt: {
          id: 'usdt',
          symbol: 'vUSDT',
          address: contracts.MAIN.VBEP.usdt
        },
        busd: {
          id: 'busd',
          symbol: 'vBUSD',
          address: contracts.MAIN.VBEP.busd
        },
        bnb: {
          id: 'bnb',
          symbol: 'vBNB',
          address: contracts.MAIN.VBEP.bnb
        },
        xvs: {
          id: 'xvs',
          symbol: 'vXVS',
          address: contracts.MAIN.VBEP.xvs
        },
        btcb: {
          id: 'btcb',
          symbol: 'vBTC',
          address: contracts.MAIN.VBEP.btcb
        },
        eth: {
          id: 'eth',
          symbol: 'vETH',
          address: contracts.MAIN.VBEP.eth
        },
        ltc: {
          id: 'ltc',
          symbol: 'vLTC',
          address: contracts.MAIN.VBEP.ltc
        },
        xrp: {
          id: 'xrp',
          symbol: 'vXRP',
          address: contracts.MAIN.VBEP.xrp
        },
        bch: {
          id: 'bch',
          symbol: 'vBCH',
          address: contracts.MAIN.VBEP.bch
        },
        dot: {
          id: 'dot',
          symbol: 'vDOT',
          address: contracts.MAIN.VBEP.dot
        },
        link: {
          id: 'link',
          symbol: 'vLINK',
          address: contracts.MAIN.VBEP.link
        },
        dai: {
          id: 'dai',
          symbol: 'vDAI',
          address: contracts.MAIN.VBEP.dai
        },
        fil: {
          id: 'fil',
          symbol: 'vFIL',
          address: contracts.MAIN.VBEP.fil
        },
        beth: {
          id: 'beth',
          symbol: 'vBETH',
          address: contracts.MAIN.VBEP.beth
        },
        ada: {
          id: 'ada',
          symbol: 'vADA',
          address: contracts.MAIN.VBEP.ada
        },
        doge: {
          id: 'doge',
          symbol: 'vDOGE',
          address: contracts.MAIN.VBEP.doge
        },
        matic: {
          id: 'matic',
          symbol: 'vMATIC',
          address: contracts.MAIN.VBEP.matic
        },
        cake: {
          id: 'cake',
          symbol: 'vCAKE',
          address: contracts.MAIN.VBEP.cake
        },
        aave: {
          id: 'aave',
          symbol: 'vAAVE',
          address: contracts.MAIN.VBEP.aave
        },
        tusd: {
          id: 'tusd',
          symbol: 'vTUSD',
          address: contracts.MAIN.VBEP.tusd
        }
      };
