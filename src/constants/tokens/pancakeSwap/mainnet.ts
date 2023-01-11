import { Token } from 'types';

import { MAINNET_TOKENS } from '../common/mainnet';

// List adapted from PancakeSwap's repository:
// https://github.com/pancakeswap/token-list/blob/main/src/tokens/pancakeswap-extended.json
export const MAINNET_PANCAKE_SWAP_TOKENS = {
  wbnb: {
    symbol: 'WBNB',
    decimals: 18,
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    asset:
      'https://tokens.pancakeswap.finance/images/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png',
  } as Token,
  bunny: {
    symbol: 'BUNNY',
    decimals: 18,
    address: '0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51',
    asset:
      'https://tokens.pancakeswap.finance/images/0xC9849E6fdB743d08fAeE3E34dd2D1bc69EA11a51.png',
  } as Token,
  alpaca: {
    symbol: 'ALPACA',
    decimals: 18,
    address: '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
    asset:
      'https://tokens.pancakeswap.finance/images/0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F.png',
  } as Token,
  fine: {
    symbol: 'FINE',
    decimals: 18,
    address: '0x4e6415a5727ea08aAE4580057187923aeC331227',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4e6415a5727ea08aAE4580057187923aeC331227.png',
  } as Token,
  bake: {
    symbol: 'BAKE',
    decimals: 18,
    address: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    asset:
      'https://tokens.pancakeswap.finance/images/0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5.png',
  } as Token,
  band: {
    symbol: 'BAND',
    decimals: 18,
    address: '0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18',
    asset:
      'https://tokens.pancakeswap.finance/images/0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18.png',
  } as Token,
  eos: {
    symbol: 'EOS',
    decimals: 18,
    address: '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6',
    asset:
      'https://tokens.pancakeswap.finance/images/0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6.png',
  } as Token,
  atom: {
    symbol: 'ATOM',
    decimals: 18,
    address: '0x0Eb3a705fc54725037CC9e008bDede697f62F335',
    asset:
      'https://tokens.pancakeswap.finance/images/0x0Eb3a705fc54725037CC9e008bDede697f62F335.png',
  } as Token,
  xtz: {
    symbol: 'XTZ',
    decimals: 18,
    address: '0x16939ef78684453bfDFb47825F8a5F714f12623a',
    asset:
      'https://tokens.pancakeswap.finance/images/0x16939ef78684453bfDFb47825F8a5F714f12623a.png',
  } as Token,
  ont: {
    symbol: 'ONT',
    decimals: 18,
    address: '0xFd7B3A77848f1C2D67E05E54d78d174a0C850335',
    asset:
      'https://tokens.pancakeswap.finance/images/0xFd7B3A77848f1C2D67E05E54d78d174a0C850335.png',
  } as Token,
  zec: {
    symbol: 'ZEC',
    decimals: 18,
    address: '0x1Ba42e5193dfA8B03D15dd1B86a3113bbBEF8Eeb',
    asset:
      'https://tokens.pancakeswap.finance/images/0x1Ba42e5193dfA8B03D15dd1B86a3113bbBEF8Eeb.png',
  } as Token,
  yfii: {
    symbol: 'YFII',
    decimals: 18,
    address: '0x7F70642d88cf1C4a3a7abb072B53B929b653edA5',
    asset:
      'https://tokens.pancakeswap.finance/images/0x7F70642d88cf1C4a3a7abb072B53B929b653edA5.png',
  } as Token,
  cream: {
    symbol: 'CREAM',
    decimals: 18,
    address: '0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888',
    asset:
      'https://tokens.pancakeswap.finance/images/0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888.png',
  } as Token,
  prom: {
    symbol: 'PROM',
    decimals: 18,
    address: '0xaF53d56ff99f1322515E54FdDE93FF8b3b7DAFd5',
    asset:
      'https://tokens.pancakeswap.finance/images/0xaF53d56ff99f1322515E54FdDE93FF8b3b7DAFd5.png',
  } as Token,
  ankr: {
    symbol: 'ANKR',
    decimals: 18,
    address: '0xf307910A4c7bbc79691fD374889b36d8531B08e3',
    asset:
      'https://tokens.pancakeswap.finance/images/0xf307910A4c7bbc79691fD374889b36d8531B08e3.png',
  } as Token,
  burger: {
    symbol: 'BURGER',
    decimals: 18,
    address: '0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f',
    asset:
      'https://tokens.pancakeswap.finance/images/0xAe9269f27437f0fcBC232d39Ec814844a51d6b8f.png',
  } as Token,
  sparta: {
    symbol: 'SPARTA',
    decimals: 18,
    address: '0x3910db0600eA925F63C36DdB1351aB6E2c6eb102',
    asset:
      'https://tokens.pancakeswap.finance/images/0x3910db0600eA925F63C36DdB1351aB6E2c6eb102.png',
  } as Token,
  twt: {
    symbol: 'TWT',
    decimals: 18,
    address: '0x4B0F1812e5Df2A09796481Ff14017e6005508003',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4B0F1812e5Df2A09796481Ff14017e6005508003.png',
  } as Token,
  alpha: {
    symbol: 'ALPHA',
    decimals: 18,
    address: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975',
    asset:
      'https://tokens.pancakeswap.finance/images/0xa1faa113cbE53436Df28FF0aEe54275c13B40975.png',
  } as Token,
  bifi: {
    symbol: 'BIFI',
    decimals: 18,
    address: '0xCa3F508B8e4Dd382eE878A314789373D80A5190A',
    asset:
      'https://tokens.pancakeswap.finance/images/0xCa3F508B8e4Dd382eE878A314789373D80A5190A.png',
  } as Token,
  yfi: {
    symbol: 'YFI',
    decimals: 18,
    address: '0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e',
    asset:
      'https://tokens.pancakeswap.finance/images/0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e.png',
  } as Token,
  uni: {
    symbol: 'UNI',
    decimals: 18,
    address: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
    asset:
      'https://tokens.pancakeswap.finance/images/0xBf5140A22578168FD562DCcF235E5D43A02ce9B1.png',
  } as Token,
  kava: {
    symbol: 'KAVA',
    decimals: 6,
    address: '0x5F88AB06e8dfe89DF127B2430Bba4Af600866035',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5F88AB06e8dfe89DF127B2430Bba4Af600866035.png',
  } as Token,
  inj: {
    symbol: 'INJ',
    decimals: 18,
    address: '0xa2B726B1145A4773F68593CF171187d8EBe4d495',
    asset:
      'https://tokens.pancakeswap.finance/images/0xa2B726B1145A4773F68593CF171187d8EBe4d495.png',
  } as Token,
  ctk: {
    symbol: 'CTK',
    decimals: 6,
    address: '0xA8c2B8eec3d368C0253ad3dae65a5F2BBB89c929',
    asset:
      'https://tokens.pancakeswap.finance/images/0xA8c2B8eec3d368C0253ad3dae65a5F2BBB89c929.png',
  } as Token,
  hard: {
    symbol: 'HARD',
    decimals: 6,
    address: '0xf79037F6f6bE66832DE4E7516be52826BC3cBcc4',
    asset:
      'https://tokens.pancakeswap.finance/images/0xf79037F6f6bE66832DE4E7516be52826BC3cBcc4.png',
  } as Token,
  broobee: {
    symbol: 'bROOBEE',
    decimals: 18,
    address: '0xE64F5Cb844946C1F102Bd25bBD87a5aB4aE89Fbe',
    asset:
      'https://tokens.pancakeswap.finance/images/0xE64F5Cb844946C1F102Bd25bBD87a5aB4aE89Fbe.png',
  } as Token,
  unfi: {
    symbol: 'UNFI',
    decimals: 18,
    address: '0x728C5baC3C3e370E372Fc4671f9ef6916b814d8B',
    asset:
      'https://tokens.pancakeswap.finance/images/0x728C5baC3C3e370E372Fc4671f9ef6916b814d8B.png',
  } as Token,
  blk: {
    symbol: 'BLK',
    decimals: 6,
    address: '0x63870A18B6e42b01Ef1Ad8A2302ef50B7132054F',
    asset:
      'https://tokens.pancakeswap.finance/images/0x63870A18B6e42b01Ef1Ad8A2302ef50B7132054F.png',
  } as Token,
  kun: {
    symbol: 'KUN',
    decimals: 18,
    address: '0x1A2fb0Af670D0234c2857FaD35b789F8Cb725584',
    asset:
      'https://tokens.pancakeswap.finance/images/0x1A2fb0Af670D0234c2857FaD35b789F8Cb725584.png',
  } as Token,
  juv: {
    symbol: 'JUV',
    decimals: 2,
    address: '0xC40C9A843E1c6D01b7578284a9028854f6683b1B',
    asset:
      'https://tokens.pancakeswap.finance/images/0xC40C9A843E1c6D01b7578284a9028854f6683b1B.png',
  } as Token,
  psg: {
    symbol: 'PSG',
    decimals: 2,
    address: '0xBc5609612b7C44BEf426De600B5fd1379DB2EcF1',
    asset:
      'https://tokens.pancakeswap.finance/images/0xBc5609612b7C44BEf426De600B5fd1379DB2EcF1.png',
  } as Token,
  ditto: {
    symbol: 'DITTO',
    decimals: 9,
    address: '0x233d91A0713155003fc4DcE0AFa871b508B3B715',
    asset:
      'https://tokens.pancakeswap.finance/images/0x233d91A0713155003fc4DcE0AFa871b508B3B715.png',
  } as Token,
  math: {
    symbol: 'MATH',
    decimals: 18,
    address: '0xF218184Af829Cf2b0019F8E6F0b2423498a36983',
    asset:
      'https://tokens.pancakeswap.finance/images/0xF218184Af829Cf2b0019F8E6F0b2423498a36983.png',
  } as Token,
  fuel: {
    symbol: 'FUEL',
    decimals: 18,
    address: '0x2090c8295769791ab7A3CF1CC6e0AA19F35e441A',
    asset:
      'https://tokens.pancakeswap.finance/images/0x2090c8295769791ab7A3CF1CC6e0AA19F35e441A.png',
  } as Token,
  nuls: {
    symbol: 'NULS',
    decimals: 8,
    address: '0x8CD6e29d3686d24d3C2018CEe54621eA0f89313B',
    asset:
      'https://tokens.pancakeswap.finance/images/0x8CD6e29d3686d24d3C2018CEe54621eA0f89313B.png',
  } as Token,
  nvt: {
    symbol: 'NVT',
    decimals: 8,
    address: '0xf0E406c49C63AbF358030A299C0E00118C4C6BA5',
    asset:
      'https://tokens.pancakeswap.finance/images/0xf0E406c49C63AbF358030A299C0E00118C4C6BA5.png',
  } as Token,
  nrv: {
    symbol: 'NRV',
    decimals: 18,
    address: '0x42F6f551ae042cBe50C739158b4f0CAC0Edb9096',
    asset:
      'https://tokens.pancakeswap.finance/images/0x42F6f551ae042cBe50C739158b4f0CAC0Edb9096.png',
  } as Token,
  reef: {
    symbol: 'REEF',
    decimals: 18,
    address: '0xF21768cCBC73Ea5B6fd3C687208a7c2def2d966e',
    asset:
      'https://tokens.pancakeswap.finance/images/0xF21768cCBC73Ea5B6fd3C687208a7c2def2d966e.png',
  } as Token,
  og: {
    symbol: 'OG',
    decimals: 2,
    address: '0xf05E45aD22150677a017Fbd94b84fBB63dc9b44c',
    asset:
      'https://tokens.pancakeswap.finance/images/0xf05E45aD22150677a017Fbd94b84fBB63dc9b44c.png',
  } as Token,
  atm: {
    symbol: 'ATM',
    decimals: 2,
    address: '0x25E9d05365c867E59C1904E7463Af9F312296f9E',
    asset:
      'https://tokens.pancakeswap.finance/images/0x25E9d05365c867E59C1904E7463Af9F312296f9E.png',
  } as Token,
  asr: {
    symbol: 'ASR',
    decimals: 2,
    address: '0x80D5f92C2c8C682070C95495313dDB680B267320',
    asset:
      'https://tokens.pancakeswap.finance/images/0x80D5f92C2c8C682070C95495313dDB680B267320.png',
  } as Token,
  balbt: {
    symbol: 'bALBT',
    decimals: 18,
    address: '0x72fAa679E1008Ad8382959FF48E392042A8b06f7',
    asset:
      'https://tokens.pancakeswap.finance/images/0x72fAa679E1008Ad8382959FF48E392042A8b06f7.png',
  } as Token,
  ten: {
    symbol: 'TEN',
    decimals: 18,
    address: '0xdFF8cb622790b7F92686c722b02CaB55592f152C',
    asset:
      'https://tokens.pancakeswap.finance/images/0xdFF8cb622790b7F92686c722b02CaB55592f152C.png',
  } as Token,
  helmet: {
    symbol: 'Helmet',
    decimals: 18,
    address: '0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8',
    asset:
      'https://tokens.pancakeswap.finance/images/0x948d2a81086A075b3130BAc19e4c6DEe1D2E3fE8.png',
  } as Token,
  bscx: {
    symbol: 'BSCX',
    decimals: 18,
    address: '0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5Ac52EE5b2a633895292Ff6d8A89bB9190451587.png',
  } as Token,
  btcst: {
    symbol: 'BTCST',
    decimals: 17,
    address: '0x78650B139471520656b9E7aA7A5e9276814a38e9',
    asset:
      'https://tokens.pancakeswap.finance/images/0x78650B139471520656b9E7aA7A5e9276814a38e9.png',
  } as Token,
  front: {
    symbol: 'FRONT',
    decimals: 18,
    address: '0x928e55daB735aa8260AF3cEDadA18B5f70C72f1b',
    asset:
      'https://tokens.pancakeswap.finance/images/0x928e55daB735aa8260AF3cEDadA18B5f70C72f1b.png',
  } as Token,
  mtsla: {
    symbol: 'mTSLA',
    decimals: 18,
    address: '0xF215A127A196e3988C09d052e16BcFD365Cd7AA3',
    asset:
      'https://tokens.pancakeswap.finance/images/0xF215A127A196e3988C09d052e16BcFD365Cd7AA3.png',
  } as Token,
  mamzn: {
    symbol: 'mAMZN',
    decimals: 18,
    address: '0x3947B992DC0147D2D89dF0392213781b04B25075',
    asset:
      'https://tokens.pancakeswap.finance/images/0x3947B992DC0147D2D89dF0392213781b04B25075.png',
  } as Token,
  mnflx: {
    symbol: 'mNFLX',
    decimals: 18,
    address: '0xa04F060077D90Fe2647B61e4dA4aD1F97d6649dc',
    asset:
      'https://tokens.pancakeswap.finance/images/0xa04F060077D90Fe2647B61e4dA4aD1F97d6649dc.png',
  } as Token,
  mgoogl: {
    symbol: 'mGOOGL',
    decimals: 18,
    address: '0x62D71B23bF15218C7d2D7E48DBbD9e9c650B173f',
    asset:
      'https://tokens.pancakeswap.finance/images/0x62D71B23bF15218C7d2D7E48DBbD9e9c650B173f.png',
  } as Token,
  bfi: {
    symbol: 'BFI',
    decimals: 18,
    address: '0x81859801b01764D4f0Fa5E64729f5a6C3b91435b',
    asset:
      'https://tokens.pancakeswap.finance/images/0x81859801b01764D4f0Fa5E64729f5a6C3b91435b.png',
  } as Token,
  bdo: {
    symbol: 'BDO',
    decimals: 18,
    address: '0x190b589cf9Fb8DDEabBFeae36a813FFb2A702454',
    asset:
      'https://tokens.pancakeswap.finance/images/0x190b589cf9Fb8DDEabBFeae36a813FFb2A702454.png',
  } as Token,
  egld: {
    symbol: 'EGLD',
    decimals: 18,
    address: '0xbF7c81FFF98BbE61B40Ed186e4AfD6DDd01337fe',
    asset:
      'https://tokens.pancakeswap.finance/images/0xbF7c81FFF98BbE61B40Ed186e4AfD6DDd01337fe.png',
  } as Token,
  auto: {
    symbol: 'AUTO',
    decimals: 18,
    address: '0xa184088a740c695E156F91f5cC086a06bb78b827',
    asset:
      'https://tokens.pancakeswap.finance/images/0xa184088a740c695E156F91f5cC086a06bb78b827.png',
  } as Token,
  hget: {
    symbol: 'HGET',
    decimals: 6,
    address: '0xC7d8D35EBA58a0935ff2D5a33Df105DD9f071731',
    asset:
      'https://tokens.pancakeswap.finance/images/0xC7d8D35EBA58a0935ff2D5a33Df105DD9f071731.png',
  } as Token,
  lit: {
    symbol: 'LIT',
    decimals: 18,
    address: '0xb59490aB09A0f526Cc7305822aC65f2Ab12f9723',
    asset:
      'https://tokens.pancakeswap.finance/images/0xb59490aB09A0f526Cc7305822aC65f2Ab12f9723.png',
  } as Token,
  lina: {
    symbol: 'LINA',
    decimals: 18,
    address: '0x762539b45A1dCcE3D36d080F74d1AED37844b878',
    asset:
      'https://tokens.pancakeswap.finance/images/0x762539b45A1dCcE3D36d080F74d1AED37844b878.png',
  } as Token,
  lusd: {
    symbol: 'lUSD',
    decimals: 18,
    address: '0x23e8a70534308a4AAF76fb8C32ec13d17a3BD89e',
    asset:
      'https://tokens.pancakeswap.finance/images/0x23e8a70534308a4AAF76fb8C32ec13d17a3BD89e.png',
  } as Token,
  sfp: {
    symbol: 'SFP',
    decimals: 18,
    address: '0xD41FDb03Ba84762dD66a0af1a6C8540FF1ba5dfb',
    asset:
      'https://tokens.pancakeswap.finance/images/0xD41FDb03Ba84762dD66a0af1a6C8540FF1ba5dfb.png',
  } as Token,
  comp: {
    symbol: 'COMP',
    decimals: 18,
    address: '0x52CE071Bd9b1C4B00A0b92D298c512478CaD67e8',
    asset:
      'https://tokens.pancakeswap.finance/images/0x52CE071Bd9b1C4B00A0b92D298c512478CaD67e8.png',
  } as Token,
  renbtc: {
    symbol: 'renBTC',
    decimals: 8,
    address: '0xfCe146bF3146100cfe5dB4129cf6C82b0eF4Ad8c',
    asset:
      'https://tokens.pancakeswap.finance/images/0xfCe146bF3146100cfe5dB4129cf6C82b0eF4Ad8c.png',
  } as Token,
  anymtlx: {
    symbol: 'anyMTLX',
    decimals: 18,
    address: '0x5921DEE8556c4593EeFCFad3CA5e2f618606483b',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5921DEE8556c4593EeFCFad3CA5e2f618606483b.png',
  } as Token,
  zee: {
    symbol: 'ZEE',
    decimals: 18,
    address: '0x44754455564474A89358B2C2265883DF993b12F0',
    asset:
      'https://tokens.pancakeswap.finance/images/0x44754455564474A89358B2C2265883DF993b12F0.png',
  } as Token,
  bry: {
    symbol: 'BRY',
    decimals: 18,
    address: '0xf859Bf77cBe8699013d6Dbc7C2b926Aaf307F830',
    asset:
      'https://tokens.pancakeswap.finance/images/0xf859Bf77cBe8699013d6Dbc7C2b926Aaf307F830.png',
  } as Token,
  swingby: {
    symbol: 'SWINGBY',
    decimals: 18,
    address: '0x71DE20e0C4616E7fcBfDD3f875d568492cBE4739',
    asset:
      'https://tokens.pancakeswap.finance/images/0x71DE20e0C4616E7fcBfDD3f875d568492cBE4739.png',
  } as Token,
  dodo: {
    symbol: 'DODO',
    decimals: 18,
    address: '0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2',
    asset:
      'https://tokens.pancakeswap.finance/images/0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2.png',
  } as Token,
  sushi: {
    symbol: 'SUSHI',
    decimals: 18,
    address: '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4',
    asset:
      'https://tokens.pancakeswap.finance/images/0x947950BcC74888a40Ffa2593C5798F11Fc9124C4.png',
  } as Token,
  bmxx: {
    symbol: 'bMXX',
    decimals: 18,
    address: '0x4131b87F74415190425ccD873048C708F8005823',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4131b87F74415190425ccD873048C708F8005823.png',
  } as Token,
  iotx: {
    symbol: 'IOTX',
    decimals: 18,
    address: '0x9678E42ceBEb63F23197D726B29b1CB20d0064E5',
    asset:
      'https://tokens.pancakeswap.finance/images/0x9678E42ceBEb63F23197D726B29b1CB20d0064E5.png',
  } as Token,
  xmark: {
    symbol: 'xMARK',
    decimals: 9,
    address: '0x26A5dFab467d4f58fB266648CAe769503CEC9580',
    asset:
      'https://tokens.pancakeswap.finance/images/0x26A5dFab467d4f58fB266648CAe769503CEC9580.png',
  } as Token,
  tpt: {
    symbol: 'TPT',
    decimals: 4,
    address: '0xECa41281c24451168a37211F0bc2b8645AF45092',
    asset:
      'https://tokens.pancakeswap.finance/images/0xECa41281c24451168a37211F0bc2b8645AF45092.png',
  } as Token,
  watch: {
    symbol: 'WATCH',
    decimals: 18,
    address: '0x7A9f28EB62C791422Aa23CeAE1dA9C847cBeC9b0',
    asset:
      'https://tokens.pancakeswap.finance/images/0x7A9f28EB62C791422Aa23CeAE1dA9C847cBeC9b0.png',
  } as Token,
  bel: {
    symbol: 'BEL',
    decimals: 18,
    address: '0x8443f091997f06a61670B735ED92734F5628692F',
    asset:
      'https://tokens.pancakeswap.finance/images/0x8443f091997f06a61670B735ED92734F5628692F.png',
  } as Token,
  eps: {
    symbol: 'EPS',
    decimals: 18,
    address: '0xA7f552078dcC247C2684336020c03648500C6d9F',
    asset:
      'https://tokens.pancakeswap.finance/images/0xA7f552078dcC247C2684336020c03648500C6d9F.png',
  } as Token,
  belt: {
    symbol: 'BELT',
    decimals: 18,
    address: '0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f',
    asset:
      'https://tokens.pancakeswap.finance/images/0xE0e514c71282b6f4e823703a39374Cf58dc3eA4f.png',
  } as Token,
  tko: {
    symbol: 'TKO',
    decimals: 18,
    address: '0x9f589e3eabe42ebC94A44727b3f3531C0c877809',
    asset:
      'https://tokens.pancakeswap.finance/images/0x9f589e3eabe42ebC94A44727b3f3531C0c877809.png',
  } as Token,
  dexe: {
    symbol: 'DEXE',
    decimals: 18,
    address: '0x039cB485212f996A9DBb85A9a75d898F94d38dA6',
    asset:
      'https://tokens.pancakeswap.finance/images/0x039cB485212f996A9DBb85A9a75d898F94d38dA6.png',
  } as Token,
  ramp: {
    symbol: 'RAMP',
    decimals: 18,
    address: '0x8519EA49c997f50cefFa444d240fB655e89248Aa',
    asset:
      'https://tokens.pancakeswap.finance/images/0x8519EA49c997f50cefFa444d240fB655e89248Aa.png',
  } as Token,
  bat: {
    symbol: 'BAT',
    decimals: 18,
    address: '0x101d82428437127bF1608F699CD651e6Abf9766E',
    asset:
      'https://tokens.pancakeswap.finance/images/0x101d82428437127bF1608F699CD651e6Abf9766E.png',
  } as Token,
  bux: {
    symbol: 'BUX',
    decimals: 18,
    address: '0x211FfbE424b90e25a15531ca322adF1559779E45',
    asset:
      'https://tokens.pancakeswap.finance/images/0x211FfbE424b90e25a15531ca322adF1559779E45.png',
  } as Token,
  for: {
    symbol: 'FOR',
    decimals: 18,
    address: '0x658A109C5900BC6d2357c87549B651670E5b0539',
    asset:
      'https://tokens.pancakeswap.finance/images/0x658A109C5900BC6d2357c87549B651670E5b0539.png',
  } as Token,
  alice: {
    symbol: 'ALICE',
    decimals: 6,
    address: '0xAC51066d7bEC65Dc4589368da368b212745d63E8',
    asset:
      'https://tokens.pancakeswap.finance/images/0xAC51066d7bEC65Dc4589368da368b212745d63E8.png',
  } as Token,
  dego: {
    symbol: 'DEGO',
    decimals: 18,
    address: '0x3FdA9383A84C05eC8f7630Fe10AdF1fAC13241CC',
    asset:
      'https://tokens.pancakeswap.finance/images/0x3FdA9383A84C05eC8f7630Fe10AdF1fAC13241CC.png',
  } as Token,
  lto: {
    symbol: 'LTO',
    decimals: 18,
    address: '0x857B222Fc79e1cBBf8Ca5f78CB133d1b7CF34BBd',
    asset:
      'https://tokens.pancakeswap.finance/images/0x857B222Fc79e1cBBf8Ca5f78CB133d1b7CF34BBd.png',
  } as Token,
  cos: {
    symbol: 'COS',
    decimals: 18,
    address: '0x96Dd399F9c3AFda1F194182F71600F1B65946501',
    asset:
      'https://tokens.pancakeswap.finance/images/0x96Dd399F9c3AFda1F194182F71600F1B65946501.png',
  } as Token,
  txl: {
    symbol: 'TXL',
    decimals: 18,
    address: '0x1FFD0b47127fdd4097E54521C9E2c7f0D66AafC5',
    asset:
      'https://tokens.pancakeswap.finance/images/0x1FFD0b47127fdd4097E54521C9E2c7f0D66AafC5.png',
  } as Token,
  dusk: {
    symbol: 'DUSK',
    decimals: 18,
    address: '0xB2BD0749DBE21f623d9BABa856D3B0f0e1BFEc9C',
    asset:
      'https://tokens.pancakeswap.finance/images/0xB2BD0749DBE21f623d9BABa856D3B0f0e1BFEc9C.png',
  } as Token,
  bdigg: {
    symbol: 'bDIGG',
    decimals: 18,
    address: '0x5986D5c77c65e5801a5cAa4fAE80089f870A71dA',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5986D5c77c65e5801a5cAa4fAE80089f870A71dA.png',
  } as Token,
  bbadger: {
    symbol: 'bBADGER',
    decimals: 18,
    address: '0x1F7216fdB338247512Ec99715587bb97BBf96eae',
    asset:
      'https://tokens.pancakeswap.finance/images/0x1F7216fdB338247512Ec99715587bb97BBf96eae.png',
  } as Token,
  trade: {
    symbol: 'TRADE',
    decimals: 18,
    address: '0x7af173F350D916358AF3e218Bdf2178494Beb748',
    asset:
      'https://tokens.pancakeswap.finance/images/0x7af173F350D916358AF3e218Bdf2178494Beb748.png',
  } as Token,
  pnt: {
    symbol: 'PNT',
    decimals: 18,
    address: '0xdaacB0Ab6Fb34d24E8a67BfA14BF4D95D4C7aF92',
    asset:
      'https://tokens.pancakeswap.finance/images/0xdaacB0Ab6Fb34d24E8a67BfA14BF4D95D4C7aF92.png',
  } as Token,
  pbtc: {
    symbol: 'pBTC',
    decimals: 18,
    address: '0xeD28A457A5A76596ac48d87C0f577020F6Ea1c4C',
    asset:
      'https://tokens.pancakeswap.finance/images/0xeD28A457A5A76596ac48d87C0f577020F6Ea1c4C.png',
  } as Token,
  mir: {
    symbol: 'MIR',
    decimals: 18,
    address: '0x5B6DcF557E2aBE2323c48445E8CC948910d8c2c9',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5B6DcF557E2aBE2323c48445E8CC948910d8c2c9.png',
  } as Token,
  pcws: {
    symbol: 'pCWS',
    decimals: 18,
    address: '0xbcf39F0EDDa668C58371E519AF37CA705f2bFcbd',
    asset:
      'https://tokens.pancakeswap.finance/images/0xbcf39F0EDDa668C58371E519AF37CA705f2bFcbd.png',
  } as Token,
  zil: {
    symbol: 'ZIL',
    decimals: 12,
    address: '0xb86AbCb37C3A4B64f74f59301AFF131a1BEcC787',
    asset:
      'https://tokens.pancakeswap.finance/images/0xb86AbCb37C3A4B64f74f59301AFF131a1BEcC787.png',
  } as Token,
  lien: {
    symbol: 'LIEN',
    decimals: 8,
    address: '0x5d684ADaf3FcFe9CFb5ceDe3abf02F0Cdd1012E3',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5d684ADaf3FcFe9CFb5ceDe3abf02F0Cdd1012E3.png',
  } as Token,
  swth: {
    symbol: 'SWTH',
    decimals: 8,
    address: '0xC0ECB8499D8dA2771aBCbF4091DB7f65158f1468',
    asset:
      'https://tokens.pancakeswap.finance/images/0xC0ECB8499D8dA2771aBCbF4091DB7f65158f1468.png',
  } as Token,
  dft: {
    symbol: 'DFT',
    decimals: 18,
    address: '0x42712dF5009c20fee340B245b510c0395896cF6e',
    asset:
      'https://tokens.pancakeswap.finance/images/0x42712dF5009c20fee340B245b510c0395896cF6e.png',
  } as Token,
  gum: {
    symbol: 'GUM',
    decimals: 18,
    address: '0xc53708664b99DF348dd27C3Ac0759d2DA9c40462',
    asset:
      'https://tokens.pancakeswap.finance/images/0xc53708664b99DF348dd27C3Ac0759d2DA9c40462.png',
  } as Token,
  one: {
    symbol: 'ONE',
    decimals: 18,
    address: '0x04BAf95Fd4C52fd09a56D840bAEe0AB8D7357bf0',
    asset:
      'https://tokens.pancakeswap.finance/images/0x04BAf95Fd4C52fd09a56D840bAEe0AB8D7357bf0.png',
  } as Token,
  ez: {
    symbol: 'EZ',
    decimals: 18,
    address: '0x5512014efa6Cd57764Fa743756F7a6Ce3358cC83',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5512014efa6Cd57764Fa743756F7a6Ce3358cC83.png',
  } as Token,
  tbtc: {
    symbol: 'tBTC',
    decimals: 9,
    address: '0x2cD1075682b0FCCaADd0Ca629e138E64015Ba11c',
    asset:
      'https://tokens.pancakeswap.finance/images/0x2cD1075682b0FCCaADd0Ca629e138E64015Ba11c.png',
  } as Token,
  hoo: {
    symbol: 'HOO',
    decimals: 8,
    address: '0xE1d1F66215998786110Ba0102ef558b22224C016',
    asset:
      'https://tokens.pancakeswap.finance/images/0xE1d1F66215998786110Ba0102ef558b22224C016.png',
  } as Token,
  oddz: {
    symbol: 'ODDZ',
    decimals: 18,
    address: '0xCD40F2670CF58720b694968698A5514e924F742d',
    asset:
      'https://tokens.pancakeswap.finance/images/0xCD40F2670CF58720b694968698A5514e924F742d.png',
  } as Token,
  apys: {
    symbol: 'APYS',
    decimals: 18,
    address: '0x37dfACfaeDA801437Ff648A1559d73f4C40aAcb7',
    asset:
      'https://tokens.pancakeswap.finance/images/0x37dfACfaeDA801437Ff648A1559d73f4C40aAcb7.png',
  } as Token,
  arpa: {
    symbol: 'ARPA',
    decimals: 18,
    address: '0x6F769E65c14Ebd1f68817F5f1DcDb61Cfa2D6f7e',
    asset:
      'https://tokens.pancakeswap.finance/images/0x6F769E65c14Ebd1f68817F5f1DcDb61Cfa2D6f7e.png',
  } as Token,
  perl: {
    symbol: 'PERL',
    decimals: 18,
    address: '0x0F9E4D49f25de22c2202aF916B681FBB3790497B',
    asset:
      'https://tokens.pancakeswap.finance/images/0x0F9E4D49f25de22c2202aF916B681FBB3790497B.png',
  } as Token,
  jgn: {
    symbol: 'JGN',
    decimals: 18,
    address: '0xC13B7a43223BB9Bf4B69BD68Ab20ca1B79d81C75',
    asset:
      'https://tokens.pancakeswap.finance/images/0xC13B7a43223BB9Bf4B69BD68Ab20ca1B79d81C75.png',
  } as Token,
  tlm: {
    symbol: 'TLM',
    decimals: 4,
    address: '0x2222227E22102Fe3322098e4CBfE18cFebD57c95',
    asset:
      'https://tokens.pancakeswap.finance/images/0x2222227E22102Fe3322098e4CBfE18cFebD57c95.png',
  } as Token,
  alpa: {
    symbol: 'ALPA',
    decimals: 18,
    address: '0xc5E6689C9c8B02be7C49912Ef19e79cF24977f03',
    asset:
      'https://tokens.pancakeswap.finance/images/0xc5E6689C9c8B02be7C49912Ef19e79cF24977f03.png',
  } as Token,
  hzn: {
    symbol: 'HZN',
    decimals: 18,
    address: '0xC0eFf7749b125444953ef89682201Fb8c6A917CD',
    asset:
      'https://tokens.pancakeswap.finance/images/0xC0eFf7749b125444953ef89682201Fb8c6A917CD.png',
  } as Token,
  mix: {
    symbol: 'MIX',
    decimals: 18,
    address: '0x398f7827DcCbeFe6990478876bBF3612D93baF05',
    asset:
      'https://tokens.pancakeswap.finance/images/0x398f7827DcCbeFe6990478876bBF3612D93baF05.png',
  } as Token,
  cgg: {
    symbol: 'CGG',
    decimals: 18,
    address: '0x1613957159E9B0ac6c80e824F7Eea748a32a0AE2',
    asset:
      'https://tokens.pancakeswap.finance/images/0x1613957159E9B0ac6c80e824F7Eea748a32a0AE2.png',
  } as Token,
  suter: {
    symbol: 'SUTER',
    decimals: 18,
    address: '0x4CfbBdfBd5BF0814472fF35C72717Bd095ADa055',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4CfbBdfBd5BF0814472fF35C72717Bd095ADa055.png',
  } as Token,
  hakka: {
    symbol: 'HAKKA',
    decimals: 18,
    address: '0x1D1eb8E8293222e1a29d2C0E4cE6C0Acfd89AaaC',
    asset:
      'https://tokens.pancakeswap.finance/images/0x1D1eb8E8293222e1a29d2C0E4cE6C0Acfd89AaaC.png',
  } as Token,
  xed: {
    symbol: 'XED',
    decimals: 18,
    address: '0x5621b5A3f4a8008c4CCDd1b942B121c8B1944F1f',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5621b5A3f4a8008c4CCDd1b942B121c8B1944F1f.png',
  } as Token,
  swamp: {
    symbol: 'SWAMP',
    decimals: 18,
    address: '0xc5A49b4CBe004b6FD55B30Ba1dE6AC360FF9765d',
    asset:
      'https://tokens.pancakeswap.finance/images/0xc5A49b4CBe004b6FD55B30Ba1dE6AC360FF9765d.png',
  } as Token,
  dfd: {
    symbol: 'DFD',
    decimals: 18,
    address: '0x9899a98b222fCb2f3dbee7dF45d943093a4ff9ff',
    asset:
      'https://tokens.pancakeswap.finance/images/0x9899a98b222fCb2f3dbee7dF45d943093a4ff9ff.png',
  } as Token,
  lmt: {
    symbol: 'LMT',
    decimals: 18,
    address: '0x9617857E191354dbEA0b714d78Bc59e57C411087',
    asset:
      'https://tokens.pancakeswap.finance/images/0x9617857E191354dbEA0b714d78Bc59e57C411087.png',
  } as Token,
  bttold: {
    symbol: 'BTTOLD',
    decimals: 18,
    address: '0x8595F9dA7b868b1822194fAEd312235E43007b49',
    asset:
      'https://tokens.pancakeswap.finance/images/0x8595F9dA7b868b1822194fAEd312235E43007b49.png',
  } as Token,
  btt: {
    symbol: 'BTT',
    decimals: 18,
    address: '0x352Cb5E19b12FC216548a2677bD0fce83BaE434B',
    asset:
      'https://tokens.pancakeswap.finance/images/0x352Cb5E19b12FC216548a2677bD0fce83BaE434B.png',
  } as Token,
  win: {
    symbol: 'WIN',
    decimals: 18,
    address: '0xaeF0d72a118ce24feE3cD1d43d383897D05B4e99',
    asset:
      'https://tokens.pancakeswap.finance/images/0xaeF0d72a118ce24feE3cD1d43d383897D05B4e99.png',
  } as Token,
  mcoin: {
    symbol: 'mCOIN',
    decimals: 18,
    address: '0x49022089e78a8D46Ec87A3AF86a1Db6c189aFA6f',
    asset:
      'https://tokens.pancakeswap.finance/images/0x49022089e78a8D46Ec87A3AF86a1Db6c189aFA6f.png',
  } as Token,
  qsd: {
    symbol: 'QSD',
    decimals: 18,
    address: '0x07AaA29E63FFEB2EBf59B33eE61437E1a91A3bb2',
    asset:
      'https://tokens.pancakeswap.finance/images/0x07AaA29E63FFEB2EBf59B33eE61437E1a91A3bb2.png',
  } as Token,
  oin: {
    symbol: 'OIN',
    decimals: 8,
    address: '0x658E64FFcF40D240A43D52CA9342140316Ae44fA',
    asset:
      'https://tokens.pancakeswap.finance/images/0x658E64FFcF40D240A43D52CA9342140316Ae44fA.png',
  } as Token,
  pmon: {
    symbol: 'PMON',
    decimals: 18,
    address: '0x1796ae0b0fa4862485106a0de9b654eFE301D0b2',
    asset:
      'https://tokens.pancakeswap.finance/images/0x1796ae0b0fa4862485106a0de9b654eFE301D0b2.png',
  } as Token,
  tdoge: {
    symbol: 'tDOGE',
    decimals: 8,
    address: '0xe550a593d09FBC8DCD557b5C88Cea6946A8b404A',
    asset:
      'https://tokens.pancakeswap.finance/images/0xe550a593d09FBC8DCD557b5C88Cea6946A8b404A.png',
  } as Token,
  ubxt: {
    symbol: 'UBXT',
    decimals: 18,
    address: '0xBbEB90cFb6FAFa1F69AA130B7341089AbeEF5811',
    asset:
      'https://tokens.pancakeswap.finance/images/0xBbEB90cFb6FAFa1F69AA130B7341089AbeEF5811.png',
  } as Token,
  btr: {
    symbol: 'BTR',
    decimals: 18,
    address: '0x5a16E8cE8cA316407c6E6307095dc9540a8D62B3',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5a16E8cE8cA316407c6E6307095dc9540a8D62B3.png',
  } as Token,
  wmass: {
    symbol: 'WMASS',
    decimals: 8,
    address: '0x7e396BfC8a2f84748701167c2d622F041A1D7a17',
    asset:
      'https://tokens.pancakeswap.finance/images/0x7e396BfC8a2f84748701167c2d622F041A1D7a17.png',
  } as Token,
  rfox: {
    symbol: 'RFOX',
    decimals: 18,
    address: '0x0a3A21356793B49154Fd3BbE91CBc2A16c0457f5',
    asset:
      'https://tokens.pancakeswap.finance/images/0x0a3A21356793B49154Fd3BbE91CBc2A16c0457f5.png',
  } as Token,
  hotcross: {
    symbol: 'HOTCROSS',
    decimals: 18,
    address: '0x4FA7163E153419E0E1064e418dd7A99314Ed27b6',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4FA7163E153419E0E1064e418dd7A99314Ed27b6.png',
  } as Token,
  xend: {
    symbol: 'XEND',
    decimals: 18,
    address: '0x4a080377f83D669D7bB83B3184a8A5E61B500608',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4a080377f83D669D7bB83B3184a8A5E61B500608.png',
  } as Token,
  chr: {
    symbol: 'CHR',
    decimals: 6,
    address: '0xf9CeC8d50f6c8ad3Fb6dcCEC577e05aA32B224FE',
    asset:
      'https://tokens.pancakeswap.finance/images/0xf9CeC8d50f6c8ad3Fb6dcCEC577e05aA32B224FE.png',
  } as Token,
  cyc: {
    symbol: 'CYC',
    decimals: 18,
    address: '0x810EE35443639348aDbbC467b33310d2AB43c168',
    asset:
      'https://tokens.pancakeswap.finance/images/0x810EE35443639348aDbbC467b33310d2AB43c168.png',
  } as Token,
  deri: {
    symbol: 'DERI',
    decimals: 18,
    address: '0xe60eaf5A997DFAe83739e035b005A33AfdCc6df5',
    asset:
      'https://tokens.pancakeswap.finance/images/0xe60eaf5A997DFAe83739e035b005A33AfdCc6df5.png',
  } as Token,
  well: {
    symbol: 'WELL',
    decimals: 18,
    address: '0xf07a32Eb035b786898c00bB1C64d8c6F8E7a46D5',
    asset:
      'https://tokens.pancakeswap.finance/images/0xf07a32Eb035b786898c00bB1C64d8c6F8E7a46D5.png',
  } as Token,
  kalm: {
    symbol: 'KALM',
    decimals: 18,
    address: '0x4BA0057f784858a48fe351445C672FF2a3d43515',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4BA0057f784858a48fe351445C672FF2a3d43515.png',
  } as Token,
  popen: {
    symbol: 'pOPEN',
    decimals: 18,
    address: '0xaBaE871B7E3b67aEeC6B46AE9FE1A91660AadAC5',
    asset:
      'https://tokens.pancakeswap.finance/images/0xaBaE871B7E3b67aEeC6B46AE9FE1A91660AadAC5.png',
  } as Token,
  xcad: {
    symbol: 'XCAD',
    decimals: 18,
    address: '0x431e0cD023a32532BF3969CddFc002c00E98429d',
    asset:
      'https://tokens.pancakeswap.finance/images/0x431e0cD023a32532BF3969CddFc002c00E98429d.png',
  } as Token,
  mtrg: {
    symbol: 'MTRG',
    decimals: 18,
    address: '0xBd2949F67DcdC549c6Ebe98696449Fa79D988A9F',
    asset:
      'https://tokens.pancakeswap.finance/images/0xBd2949F67DcdC549c6Ebe98696449Fa79D988A9F.png',
  } as Token,
  ktn: {
    symbol: 'KTN',
    decimals: 18,
    address: '0xDAe6c2A48BFAA66b43815c5548b10800919c993E',
    asset:
      'https://tokens.pancakeswap.finance/images/0xDAe6c2A48BFAA66b43815c5548b10800919c993E.png',
  } as Token,
  qkc: {
    symbol: 'QKC',
    decimals: 18,
    address: '0xA1434F1FC3F437fa33F7a781E041961C0205B5Da',
    asset:
      'https://tokens.pancakeswap.finance/images/0xA1434F1FC3F437fa33F7a781E041961C0205B5Da.png',
  } as Token,
  bcfx: {
    symbol: 'bCFX',
    decimals: 18,
    address: '0x045c4324039dA91c52C55DF5D785385Aab073DcF',
    asset:
      'https://tokens.pancakeswap.finance/images/0x045c4324039dA91c52C55DF5D785385Aab073DcF.png',
  } as Token,
  swg: {
    symbol: 'SWG',
    decimals: 18,
    address: '0xe792f64C582698b8572AAF765bDC426AC3aEfb6B',
    asset:
      'https://tokens.pancakeswap.finance/images/0xe792f64C582698b8572AAF765bDC426AC3aEfb6B.png',
  } as Token,
  mx: {
    symbol: 'MX',
    decimals: 18,
    address: '0x9F882567A62a5560d147d64871776EeA72Df41D3',
    asset:
      'https://tokens.pancakeswap.finance/images/0x9F882567A62a5560d147d64871776EeA72Df41D3.png',
  } as Token,
  ata: {
    symbol: 'ATA',
    decimals: 18,
    address: '0xA2120b9e674d3fC3875f415A7DF52e382F141225',
    asset:
      'https://tokens.pancakeswap.finance/images/0xA2120b9e674d3fC3875f415A7DF52e382F141225.png',
  } as Token,
  mbox: {
    symbol: 'MBOX',
    decimals: 18,
    address: '0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377',
    asset:
      'https://tokens.pancakeswap.finance/images/0x3203c9E46cA618C8C1cE5dC67e7e9D75f5da2377.png',
  } as Token,
  boring: {
    symbol: 'BORING',
    decimals: 18,
    address: '0xffEecbf8D7267757c2dc3d13D730E97E15BfdF7F',
    asset:
      'https://tokens.pancakeswap.finance/images/0xffEecbf8D7267757c2dc3d13D730E97E15BfdF7F.png',
  } as Token,
  marsh: {
    symbol: 'MARSH',
    decimals: 18,
    address: '0x2FA5dAF6Fe0708fBD63b1A7D1592577284f52256',
    asset:
      'https://tokens.pancakeswap.finance/images/0x2FA5dAF6Fe0708fBD63b1A7D1592577284f52256.png',
  } as Token,
  ampl: {
    symbol: 'AMPL',
    decimals: 9,
    address: '0xDB021b1B247fe2F1fa57e0A87C748Cc1E321F07F',
    asset:
      'https://tokens.pancakeswap.finance/images/0xDB021b1B247fe2F1fa57e0A87C748Cc1E321F07F.png',
  } as Token,
  o3: {
    symbol: 'O3',
    decimals: 18,
    address: '0xEe9801669C6138E84bD50dEB500827b776777d28',
    asset:
      'https://tokens.pancakeswap.finance/images/0xEe9801669C6138E84bD50dEB500827b776777d28.png',
  } as Token,
  hai: {
    symbol: 'HAI',
    decimals: 8,
    address: '0xaA9E582e5751d703F85912903bacADdFed26484C',
    asset:
      'https://tokens.pancakeswap.finance/images/0xaA9E582e5751d703F85912903bacADdFed26484C.png',
  } as Token,
  htb: {
    symbol: 'HTB',
    decimals: 18,
    address: '0x4e840AADD28DA189B9906674B4Afcb77C128d9ea',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4e840AADD28DA189B9906674B4Afcb77C128d9ea.png',
  } as Token,
  dg: {
    symbol: 'DG',
    decimals: 18,
    address: '0x9Fdc3ae5c814b79dcA2556564047C5e7e5449C19',
    asset:
      'https://tokens.pancakeswap.finance/images/0x9Fdc3ae5c814b79dcA2556564047C5e7e5449C19.png',
  } as Token,
  woo: {
    symbol: 'WOO',
    decimals: 18,
    address: '0x4691937a7508860F876c9c0a2a617E7d9E945D4B',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4691937a7508860F876c9c0a2a617E7d9E945D4B.png',
  } as Token,
  form: {
    symbol: 'FORM',
    decimals: 18,
    address: '0x25A528af62e56512A19ce8c3cAB427807c28CC19',
    asset:
      'https://tokens.pancakeswap.finance/images/0x25A528af62e56512A19ce8c3cAB427807c28CC19.png',
  } as Token,
  orbs: {
    symbol: 'ORBS',
    decimals: 18,
    address: '0xeBd49b26169e1b52c04cFd19FCf289405dF55F80',
    asset:
      'https://tokens.pancakeswap.finance/images/0xeBd49b26169e1b52c04cFd19FCf289405dF55F80.png',
  } as Token,
  wex: {
    symbol: 'WEX',
    decimals: 18,
    address: '0xa9c41A46a6B3531d28d5c32F6633dd2fF05dFB90',
    asset:
      'https://tokens.pancakeswap.finance/images/0xa9c41A46a6B3531d28d5c32F6633dd2fF05dFB90.png',
  } as Token,
  waultx: {
    symbol: 'WAULTx',
    decimals: 18,
    address: '0xB64E638E60D154B43f660a6BF8fD8a3b249a6a21',
    asset:
      'https://tokens.pancakeswap.finance/images/0xB64E638E60D154B43f660a6BF8fD8a3b249a6a21.png',
  } as Token,
  rabbit: {
    symbol: 'RABBIT',
    decimals: 18,
    address: '0x95a1199EBA84ac5f19546519e287d43D2F0E1b41',
    asset:
      'https://tokens.pancakeswap.finance/images/0x95a1199EBA84ac5f19546519e287d43D2F0E1b41.png',
  } as Token,
  bscpad: {
    symbol: 'BSCPAD',
    decimals: 18,
    address: '0x5A3010d4d8D3B5fB49f8B6E57FB9E48063f16700',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5A3010d4d8D3B5fB49f8B6E57FB9E48063f16700.png',
  } as Token,
  adx: {
    symbol: 'ADX',
    decimals: 18,
    address: '0x6bfF4Fb161347ad7de4A625AE5aa3A1CA7077819',
    asset:
      'https://tokens.pancakeswap.finance/images/0x6bfF4Fb161347ad7de4A625AE5aa3A1CA7077819.png',
  } as Token,
  dvi: {
    symbol: 'DVI',
    decimals: 18,
    address: '0x758FB037A375F17c7e195CC634D77dA4F554255B',
    asset:
      'https://tokens.pancakeswap.finance/images/0x758FB037A375F17c7e195CC634D77dA4F554255B.png',
  } as Token,
  mask: {
    symbol: 'MASK',
    decimals: 18,
    address: '0x2eD9a5C8C13b93955103B9a7C167B67Ef4d568a3',
    asset:
      'https://tokens.pancakeswap.finance/images/0x2eD9a5C8C13b93955103B9a7C167B67Ef4d568a3.png',
  } as Token,
  titan: {
    symbol: 'TITAN',
    decimals: 18,
    address: '0xe898EDc43920F357A93083F1d4460437dE6dAeC2',
    asset:
      'https://tokens.pancakeswap.finance/images/0xe898EDc43920F357A93083F1d4460437dE6dAeC2.png',
  } as Token,
  chess: {
    symbol: 'CHESS',
    decimals: 18,
    address: '0x20de22029ab63cf9A7Cf5fEB2b737Ca1eE4c82A6',
    asset:
      'https://tokens.pancakeswap.finance/images/0x20de22029ab63cf9A7Cf5fEB2b737Ca1eE4c82A6.png',
  } as Token,
  axs: {
    symbol: 'AXS',
    decimals: 18,
    address: '0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0',
    asset:
      'https://tokens.pancakeswap.finance/images/0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0.png',
  } as Token,
  c98: {
    symbol: 'C98',
    decimals: 18,
    address: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
    asset:
      'https://tokens.pancakeswap.finance/images/0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6.png',
  } as Token,
  sps: {
    symbol: 'SPS',
    decimals: 18,
    address: '0x1633b7157e7638C4d6593436111Bf125Ee74703F',
    asset:
      'https://tokens.pancakeswap.finance/images/0x1633b7157e7638C4d6593436111Bf125Ee74703F.png',
  } as Token,
  if: {
    symbol: 'IF',
    decimals: 18,
    address: '0xB0e1fc65C1a741b4662B813eB787d369b8614Af1',
    asset:
      'https://tokens.pancakeswap.finance/images/0xB0e1fc65C1a741b4662B813eB787d369b8614Af1.png',
  } as Token,
  skill: {
    symbol: 'SKILL',
    decimals: 18,
    address: '0x154A9F9cbd3449AD22FDaE23044319D6eF2a1Fab',
    asset:
      'https://tokens.pancakeswap.finance/images/0x154A9F9cbd3449AD22FDaE23044319D6eF2a1Fab.png',
  } as Token,
  revv: {
    symbol: 'REVV',
    decimals: 18,
    address: '0x833F307aC507D47309fD8CDD1F835BeF8D702a93',
    asset:
      'https://tokens.pancakeswap.finance/images/0x833F307aC507D47309fD8CDD1F835BeF8D702a93.png',
  } as Token,
  bmon: {
    symbol: 'BMON',
    decimals: 18,
    address: '0x08ba0619b1e7A582E0BCe5BBE9843322C954C340',
    asset:
      'https://tokens.pancakeswap.finance/images/0x08ba0619b1e7A582E0BCe5BBE9843322C954C340.png',
  } as Token,
  babycake: {
    symbol: 'BABYCAKE',
    decimals: 18,
    address: '0xdB8D30b74bf098aF214e862C90E647bbB1fcC58c',
    asset:
      'https://tokens.pancakeswap.finance/images/0xdB8D30b74bf098aF214e862C90E647bbB1fcC58c.png',
  } as Token,
  wsg: {
    symbol: 'WSG',
    decimals: 18,
    address: '0xA58950F05FeA2277d2608748412bf9F802eA4901',
    asset:
      'https://tokens.pancakeswap.finance/images/0xA58950F05FeA2277d2608748412bf9F802eA4901.png',
  } as Token,
  hero: {
    symbol: 'HERO',
    decimals: 18,
    address: '0xE8176d414560cFE1Bf82Fd73B986823B89E4F545',
    asset:
      'https://tokens.pancakeswap.finance/images/0xE8176d414560cFE1Bf82Fd73B986823B89E4F545.png',
  } as Token,
  mcrn: {
    symbol: 'MCRN',
    decimals: 18,
    address: '0xacb2d47827C9813AE26De80965845D80935afd0B',
    asset:
      'https://tokens.pancakeswap.finance/images/0xacb2d47827C9813AE26De80965845D80935afd0B.png',
  } as Token,
  pots: {
    symbol: 'POTS',
    decimals: 18,
    address: '0x3Fcca8648651E5b974DD6d3e50F61567779772A8',
    asset:
      'https://tokens.pancakeswap.finance/images/0x3Fcca8648651E5b974DD6d3e50F61567779772A8.png',
  } as Token,
  sfund: {
    symbol: 'SFUND',
    decimals: 18,
    address: '0x477bC8d23c634C154061869478bce96BE6045D12',
    asset:
      'https://tokens.pancakeswap.finance/images/0x477bC8d23c634C154061869478bce96BE6045D12.png',
  } as Token,
  bp: {
    symbol: 'BP',
    decimals: 18,
    address: '0xACB8f52DC63BB752a51186D1c55868ADbFfEe9C1',
    asset:
      'https://tokens.pancakeswap.finance/images/0xACB8f52DC63BB752a51186D1c55868ADbFfEe9C1.png',
  } as Token,
  rusd: {
    symbol: 'rUSD',
    decimals: 18,
    address: '0x07663837218A003e66310a01596af4bf4e44623D',
    asset:
      'https://tokens.pancakeswap.finance/images/0x07663837218A003e66310a01596af4bf4e44623D.png',
  } as Token,
  pha: {
    symbol: 'PHA',
    decimals: 18,
    address: '0x0112e557d400474717056C4e6D40eDD846F38351',
    asset:
      'https://tokens.pancakeswap.finance/images/0x0112e557d400474717056C4e6D40eDD846F38351.png',
  } as Token,
  naos: {
    symbol: 'NAOS',
    decimals: 18,
    address: '0x758d08864fB6cCE3062667225ca10b8F00496cc2',
    asset:
      'https://tokens.pancakeswap.finance/images/0x758d08864fB6cCE3062667225ca10b8F00496cc2.png',
  } as Token,
  qbt: {
    symbol: 'QBT',
    decimals: 18,
    address: '0x17B7163cf1Dbd286E262ddc68b553D899B93f526',
    asset:
      'https://tokens.pancakeswap.finance/images/0x17B7163cf1Dbd286E262ddc68b553D899B93f526.png',
  } as Token,
  bondly: {
    symbol: 'BONDLY',
    decimals: 18,
    address: '0x5D0158A5c3ddF47d4Ea4517d8DB0D76aA2e87563',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5D0158A5c3ddF47d4Ea4517d8DB0D76aA2e87563.png',
  } as Token,
  bscdefi: {
    symbol: 'BSCDEFI',
    decimals: 18,
    address: '0x40E46dE174dfB776BB89E04dF1C47d8a66855EB3',
    asset:
      'https://tokens.pancakeswap.finance/images/0x40E46dE174dfB776BB89E04dF1C47d8a66855EB3.png',
  } as Token,
  cvp: {
    symbol: 'CVP',
    decimals: 18,
    address: '0x5Ec3AdBDae549Dce842e24480Eb2434769e22B2E',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5Ec3AdBDae549Dce842e24480Eb2434769e22B2E.png',
  } as Token,
  tlos: {
    symbol: 'TLOS',
    decimals: 18,
    address: '0xb6C53431608E626AC81a9776ac3e999c5556717c',
    asset:
      'https://tokens.pancakeswap.finance/images/0xb6C53431608E626AC81a9776ac3e999c5556717c.png',
  } as Token,
  nft: {
    symbol: 'NFT',
    decimals: 6,
    address: '0x20eE7B720f4E4c4FFcB00C4065cdae55271aECCa',
    asset:
      'https://tokens.pancakeswap.finance/images/0x20eE7B720f4E4c4FFcB00C4065cdae55271aECCa.png',
  } as Token,
  pros: {
    symbol: 'PROS',
    decimals: 18,
    address: '0xEd8c8Aa8299C10f067496BB66f8cC7Fb338A3405',
    asset:
      'https://tokens.pancakeswap.finance/images/0xEd8c8Aa8299C10f067496BB66f8cC7Fb338A3405.png',
  } as Token,
  light: {
    symbol: 'LIGHT',
    decimals: 18,
    address: '0x037838b556d9c9d654148a284682C55bB5f56eF4',
    asset:
      'https://tokens.pancakeswap.finance/images/0x037838b556d9c9d654148a284682C55bB5f56eF4.png',
  } as Token,
  cart: {
    symbol: 'CART',
    decimals: 18,
    address: '0x5C8C8D560048F34E5f7f8ad71f2f81a89DBd273e',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5C8C8D560048F34E5f7f8ad71f2f81a89DBd273e.png',
  } as Token,
  beta: {
    symbol: 'BETA',
    decimals: 18,
    address: '0xBe1a001FE942f96Eea22bA08783140B9Dcc09D28',
    asset:
      'https://tokens.pancakeswap.finance/images/0xBe1a001FE942f96Eea22bA08783140B9Dcc09D28.png',
  } as Token,
  rpg: {
    symbol: 'RPG',
    decimals: 18,
    address: '0xc2098a8938119A52B1F7661893c0153A6CB116d5',
    asset:
      'https://tokens.pancakeswap.finance/images/0xc2098a8938119A52B1F7661893c0153A6CB116d5.png',
  } as Token,
  mcb: {
    symbol: 'MCB',
    decimals: 18,
    address: '0x5fE80d2CD054645b9419657d3d10d26391780A7B',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5fE80d2CD054645b9419657d3d10d26391780A7B.png',
  } as Token,
  lazio: {
    symbol: 'LAZIO',
    decimals: 8,
    address: '0x77d547256A2cD95F32F67aE0313E450Ac200648d',
    asset:
      'https://tokens.pancakeswap.finance/images/0x77d547256A2cD95F32F67aE0313E450Ac200648d.png',
  } as Token,
  arv: {
    symbol: 'ARV',
    decimals: 8,
    address: '0x6679eB24F59dFe111864AEc72B443d1Da666B360',
    asset:
      'https://tokens.pancakeswap.finance/images/0x6679eB24F59dFe111864AEc72B443d1Da666B360.png',
  } as Token,
  dkt: {
    symbol: 'DKT',
    decimals: 18,
    address: '0x7Ceb519718A80Dd78a8545AD8e7f401dE4f2faA7',
    asset:
      'https://tokens.pancakeswap.finance/images/0x7Ceb519718A80Dd78a8545AD8e7f401dE4f2faA7.png',
  } as Token,
  moni: {
    symbol: 'MONI',
    decimals: 18,
    address: '0x9573c88aE3e37508f87649f87c4dd5373C9F31e0',
    asset:
      'https://tokens.pancakeswap.finance/images/0x9573c88aE3e37508f87649f87c4dd5373C9F31e0.png',
  } as Token,
  xms: {
    symbol: 'XMS',
    decimals: 18,
    address: '0x7859B01BbF675d67Da8cD128a50D155cd881B576',
    asset:
      'https://tokens.pancakeswap.finance/images/0x7859B01BbF675d67Da8cD128a50D155cd881B576.png',
  } as Token,
  zoo: {
    symbol: 'ZOO',
    decimals: 18,
    address: '0x1D229B958D5DDFca92146585a8711aECbE56F095',
    asset:
      'https://tokens.pancakeswap.finance/images/0x1D229B958D5DDFca92146585a8711aECbE56F095.png',
  } as Token,
  fina: {
    symbol: 'FINA',
    decimals: 18,
    address: '0x426c72701833fdDBdFc06c944737C6031645c708',
    asset:
      'https://tokens.pancakeswap.finance/images/0x426c72701833fdDBdFc06c944737C6031645c708.png',
  } as Token,
  dar: {
    symbol: 'DAR',
    decimals: 6,
    address: '0x23CE9e926048273eF83be0A3A8Ba9Cb6D45cd978',
    asset:
      'https://tokens.pancakeswap.finance/images/0x23CE9e926048273eF83be0A3A8Ba9Cb6D45cd978.png',
  } as Token,
  xwg: {
    symbol: 'XWG',
    decimals: 18,
    address: '0x6b23C89196DeB721e6Fd9726E6C76E4810a464bc',
    asset:
      'https://tokens.pancakeswap.finance/images/0x6b23C89196DeB721e6Fd9726E6C76E4810a464bc.png',
  } as Token,
  eternal: {
    symbol: 'ETERNAL',
    decimals: 18,
    address: '0xD44FD09d74cd13838F137B590497595d6b3FEeA4',
    asset:
      'https://tokens.pancakeswap.finance/images/0xD44FD09d74cd13838F137B590497595d6b3FEeA4.png',
  } as Token,
  porto: {
    symbol: 'PORTO',
    decimals: 8,
    address: '0x49f2145d6366099e13B10FbF80646C0F377eE7f6',
    asset:
      'https://tokens.pancakeswap.finance/images/0x49f2145d6366099e13B10FbF80646C0F377eE7f6.png',
  } as Token,
  kart: {
    symbol: 'KART',
    decimals: 18,
    address: '0x8BDd8DBcBDf0C066cA5f3286d33673aA7A553C10',
    asset:
      'https://tokens.pancakeswap.finance/images/0x8BDd8DBcBDf0C066cA5f3286d33673aA7A553C10.png',
  } as Token,
  qi: {
    symbol: 'QI',
    decimals: 18,
    address: '0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5',
    asset:
      'https://tokens.pancakeswap.finance/images/0x8729438EB15e2C8B576fCc6AeCdA6A148776C0F5.png',
  } as Token,
  sheesha: {
    symbol: 'SHEESHA',
    decimals: 18,
    address: '0x232FB065D9d24c34708eeDbF03724f2e95ABE768',
    asset:
      'https://tokens.pancakeswap.finance/images/0x232FB065D9d24c34708eeDbF03724f2e95ABE768.png',
  } as Token,
  bcoin: {
    symbol: 'BCOIN',
    decimals: 18,
    address: '0x00e1656e45f18ec6747F5a8496Fd39B50b38396D',
    asset:
      'https://tokens.pancakeswap.finance/images/0x00e1656e45f18ec6747F5a8496Fd39B50b38396D.png',
  } as Token,
  quidd: {
    symbol: 'QUIDD',
    decimals: 18,
    address: '0x7961Ade0a767c0E5B67Dd1a1F78ba44F727642Ed',
    asset:
      'https://tokens.pancakeswap.finance/images/0x7961Ade0a767c0E5B67Dd1a1F78ba44F727642Ed.png',
  } as Token,
  santos: {
    symbol: 'SANTOS',
    decimals: 8,
    address: '0xA64455a4553C9034236734FadDAddbb64aCE4Cc7',
    asset:
      'https://tokens.pancakeswap.finance/images/0xA64455a4553C9034236734FadDAddbb64aCE4Cc7.png',
  } as Token,
  nabox: {
    symbol: 'NABOX',
    decimals: 18,
    address: '0x755f34709E369D37C6Fa52808aE84A32007d1155',
    asset:
      'https://tokens.pancakeswap.finance/images/0x755f34709E369D37C6Fa52808aE84A32007d1155.png',
  } as Token,
  xcv: {
    symbol: 'XCV',
    decimals: 18,
    address: '0x4be63a9b26EE89b9a3a13fd0aA1D0b2427C135f8',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4be63a9b26EE89b9a3a13fd0aA1D0b2427C135f8.png',
  } as Token,
  idia: {
    symbol: 'IDIA',
    decimals: 18,
    address: '0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89',
    asset:
      'https://tokens.pancakeswap.finance/images/0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89.png',
  } as Token,
  tt: {
    symbol: 'TT',
    decimals: 18,
    address: '0x990E7154bB999FAa9b2fa5Ed29E822703311eA85',
    asset:
      'https://tokens.pancakeswap.finance/images/0x990E7154bB999FAa9b2fa5Ed29E822703311eA85.png',
  } as Token,
  gmee: {
    symbol: 'GMEE',
    decimals: 18,
    address: '0x84e9a6F9D240FdD33801f7135908BfA16866939A',
    asset:
      'https://tokens.pancakeswap.finance/images/0x84e9a6F9D240FdD33801f7135908BfA16866939A.png',
  } as Token,
  htd: {
    symbol: 'HTD',
    decimals: 18,
    address: '0x5E2689412Fae5c29BD575fbe1d5C1CD1e0622A8f',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5E2689412Fae5c29BD575fbe1d5C1CD1e0622A8f.png',
  } as Token,
  thg: {
    symbol: 'THG',
    decimals: 18,
    address: '0x9fD87aEfe02441B123c3c32466cD9dB4c578618f',
    asset:
      'https://tokens.pancakeswap.finance/images/0x9fD87aEfe02441B123c3c32466cD9dB4c578618f.png',
  } as Token,
  dpt: {
    symbol: 'DPT',
    decimals: 18,
    address: '0xE69cAef10A488D7AF31Da46c89154d025546e990',
    asset:
      'https://tokens.pancakeswap.finance/images/0xE69cAef10A488D7AF31Da46c89154d025546e990.png',
  } as Token,
  high: {
    symbol: 'HIGH',
    decimals: 18,
    address: '0x5f4Bde007Dc06b867f86EBFE4802e34A1fFEEd63',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5f4Bde007Dc06b867f86EBFE4802e34A1fFEEd63.png',
  } as Token,
  sdao: {
    symbol: 'SDAO',
    decimals: 18,
    address: '0x90Ed8F1dc86388f14b64ba8fb4bbd23099f18240',
    asset:
      'https://tokens.pancakeswap.finance/images/0x90Ed8F1dc86388f14b64ba8fb4bbd23099f18240.png',
  } as Token,
  antex: {
    symbol: 'ANTEX',
    decimals: 8,
    address: '0xCA1aCAB14e85F30996aC83c64fF93Ded7586977C',
    asset:
      'https://tokens.pancakeswap.finance/images/0xCA1aCAB14e85F30996aC83c64fF93Ded7586977C.png',
  } as Token,
  bbt: {
    symbol: 'BBT',
    decimals: 8,
    address: '0xD48474E7444727bF500a32D5AbE01943f3A59A64',
    asset:
      'https://tokens.pancakeswap.finance/images/0xD48474E7444727bF500a32D5AbE01943f3A59A64.png',
  } as Token,
  woop: {
    symbol: 'WOOP',
    decimals: 18,
    address: '0x8b303d5BbfBbf46F1a4d9741E491e06986894e18',
    asset:
      'https://tokens.pancakeswap.finance/images/0x8b303d5BbfBbf46F1a4d9741E491e06986894e18.png',
  } as Token,
  gm: {
    symbol: 'GM',
    decimals: 18,
    address: '0xe2604C9561D490624AA35e156e65e590eB749519',
    asset:
      'https://tokens.pancakeswap.finance/images/0xe2604C9561D490624AA35e156e65e590eB749519.png',
  } as Token,
  aog: {
    symbol: 'AOG',
    decimals: 18,
    address: '0x40C8225329Bd3e28A043B029E0D07a5344d2C27C',
    asset:
      'https://tokens.pancakeswap.finance/images/0x40C8225329Bd3e28A043B029E0D07a5344d2C27C.png',
  } as Token,
  '8pay': {
    symbol: '8PAY',
    decimals: 18,
    address: '0xFeea0bDd3D07eb6FE305938878C0caDBFa169042',
    asset:
      'https://tokens.pancakeswap.finance/images/0xFeea0bDd3D07eb6FE305938878C0caDBFa169042.png',
  } as Token,
  bath: {
    symbol: 'BATH',
    decimals: 18,
    address: '0x0bc89aa98Ad94E6798Ec822d0814d934cCD0c0cE',
    asset:
      'https://tokens.pancakeswap.finance/images/0x0bc89aa98Ad94E6798Ec822d0814d934cCD0c0cE.png',
  } as Token,
  insur: {
    symbol: 'INSUR',
    decimals: 18,
    address: '0x3192CCDdf1CDcE4Ff055EbC80f3F0231b86A7E30',
    asset:
      'https://tokens.pancakeswap.finance/images/0x3192CCDdf1CDcE4Ff055EbC80f3F0231b86A7E30.png',
  } as Token,
  ertha: {
    symbol: 'ERTHA',
    decimals: 18,
    address: '0x62823659d09F9F9D2222058878f89437425eB261',
    asset:
      'https://tokens.pancakeswap.finance/images/0x62823659d09F9F9D2222058878f89437425eB261.png',
  } as Token,
  apx: {
    symbol: 'APX',
    decimals: 18,
    address: '0x78F5d389F5CDCcFc41594aBaB4B0Ed02F31398b3',
    asset:
      'https://tokens.pancakeswap.finance/images/0x78F5d389F5CDCcFc41594aBaB4B0Ed02F31398b3.png',
  } as Token,
  froyo: {
    symbol: 'FROYO',
    decimals: 18,
    address: '0xe369fec23380f9F14ffD07a1DC4b7c1a9fdD81c9',
    asset:
      'https://tokens.pancakeswap.finance/images/0xe369fec23380f9F14ffD07a1DC4b7c1a9fdD81c9.png',
  } as Token,
  fuse: {
    symbol: 'FUSE',
    decimals: 18,
    address: '0x5857c96DaE9cF8511B08Cb07f85753C472D36Ea3',
    asset:
      'https://tokens.pancakeswap.finance/images/0x5857c96DaE9cF8511B08Cb07f85753C472D36Ea3.png',
  } as Token,
  prl: {
    symbol: 'PRL',
    decimals: 18,
    address: '0xd07e82440A395f3F3551b42dA9210CD1Ef4f8B24',
    asset:
      'https://tokens.pancakeswap.finance/images/0xd07e82440A395f3F3551b42dA9210CD1Ef4f8B24.png',
  } as Token,
  raca: {
    symbol: 'RACA',
    decimals: 18,
    address: '0x12BB890508c125661E03b09EC06E404bc9289040',
    asset:
      'https://tokens.pancakeswap.finance/images/0x12BB890508c125661E03b09EC06E404bc9289040.png',
  } as Token,
  gear: {
    symbol: 'GEAR',
    decimals: 18,
    address: '0xb4404DaB7C0eC48b428Cf37DeC7fb628bcC41B36',
    asset:
      'https://tokens.pancakeswap.finance/images/0xb4404DaB7C0eC48b428Cf37DeC7fb628bcC41B36.png',
  } as Token,
  ach: {
    symbol: 'ACH',
    decimals: 8,
    address: '0xBc7d6B50616989655AfD682fb42743507003056D',
    asset:
      'https://tokens.pancakeswap.finance/images/0xBc7d6B50616989655AfD682fb42743507003056D.png',
  } as Token,
  fight: {
    symbol: 'FIGHT',
    decimals: 18,
    address: '0x4f39c3319188A723003670c3F9B9e7EF991E52F3',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4f39c3319188A723003670c3F9B9e7EF991E52F3.png',
  } as Token,
  loa: {
    symbol: 'LOA',
    decimals: 18,
    address: '0x94b69263FCA20119Ae817b6f783Fc0F13B02ad50',
    asset:
      'https://tokens.pancakeswap.finance/images/0x94b69263FCA20119Ae817b6f783Fc0F13B02ad50.png',
  } as Token,
  era: {
    symbol: 'ERA',
    decimals: 18,
    address: '0x6f9F0c4ad9Af7EbD61Ac5A1D4e0F2227F7B0E5f9',
    asset:
      'https://tokens.pancakeswap.finance/images/0x6f9F0c4ad9Af7EbD61Ac5A1D4e0F2227F7B0E5f9.png',
  } as Token,
  gmt: {
    symbol: 'GMT',
    decimals: 8,
    address: '0x3019BF2a2eF8040C242C9a4c5c4BD4C81678b2A1',
    asset:
      'https://tokens.pancakeswap.finance/images/0x3019BF2a2eF8040C242C9a4c5c4BD4C81678b2A1.png',
  } as Token,
  duet: {
    symbol: 'DUET',
    decimals: 18,
    address: '0x95EE03e1e2C5c4877f9A298F1C0D6c98698FAB7B',
    asset:
      'https://tokens.pancakeswap.finance/images/0x95EE03e1e2C5c4877f9A298F1C0D6c98698FAB7B.png',
  } as Token,
  bsw: {
    symbol: 'BSW',
    decimals: 18,
    address: '0x965F527D9159dCe6288a2219DB51fc6Eef120dD1',
    asset:
      'https://tokens.pancakeswap.finance/images/0x965F527D9159dCe6288a2219DB51fc6Eef120dD1.png',
  } as Token,
  pex: {
    symbol: 'PEX',
    decimals: 18,
    address: '0x6a0b66710567b6beb81A71F7e9466450a91a384b',
    asset:
      'https://tokens.pancakeswap.finance/images/0x6a0b66710567b6beb81A71F7e9466450a91a384b.png',
  } as Token,
  yel: {
    symbol: 'YEL',
    decimals: 18,
    address: '0xD3b71117E6C1558c1553305b44988cd944e97300',
    asset:
      'https://tokens.pancakeswap.finance/images/0xD3b71117E6C1558c1553305b44988cd944e97300.png',
  } as Token,
  tem: {
    symbol: 'TEM',
    decimals: 9,
    address: '0x19e6BfC1A6e4B042Fb20531244D47E252445df01',
    asset:
      'https://tokens.pancakeswap.finance/images/0x19e6BfC1A6e4B042Fb20531244D47E252445df01.png',
  } as Token,
  gmi: {
    symbol: 'GMI',
    decimals: 18,
    address: '0x93D8d25E3C9A847a5Da79F79ecaC89461FEcA846',
    asset:
      'https://tokens.pancakeswap.finance/images/0x93D8d25E3C9A847a5Da79F79ecaC89461FEcA846.png',
  } as Token,
  tinc: {
    symbol: 'TINC',
    decimals: 18,
    address: '0x05aD6E30A855BE07AfA57e08a4f30d00810a402e',
    asset:
      'https://tokens.pancakeswap.finance/images/0x05aD6E30A855BE07AfA57e08a4f30d00810a402e.png',
  } as Token,
  ceek: {
    symbol: 'CEEK',
    decimals: 18,
    address: '0xe0F94Ac5462997D2BC57287Ac3a3aE4C31345D66',
    asset:
      'https://tokens.pancakeswap.finance/images/0xe0F94Ac5462997D2BC57287Ac3a3aE4C31345D66.png',
  } as Token,
  happy: {
    symbol: 'HAPPY',
    decimals: 18,
    address: '0xF5d8A096CcCb31b9D7bcE5afE812BE23e3D4690d',
    asset:
      'https://tokens.pancakeswap.finance/images/0xF5d8A096CcCb31b9D7bcE5afE812BE23e3D4690d.png',
  } as Token,
  wzrd: {
    symbol: 'WZRD',
    decimals: 18,
    address: '0xFa40d8FC324bcdD6Bbae0e086De886c571C225d4',
    asset:
      'https://tokens.pancakeswap.finance/images/0xFa40d8FC324bcdD6Bbae0e086De886c571C225d4.png',
  } as Token,
  ankrbnb: {
    symbol: 'ankrBNB',
    decimals: 18,
    address: '0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827',
    asset:
      'https://tokens.pancakeswap.finance/images/0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827.png',
  } as Token,
  sand: {
    symbol: 'SAND',
    decimals: 18,
    address: '0x67b725d7e342d7B611fa85e859Df9697D9378B2e',
    asset:
      'https://tokens.pancakeswap.finance/images/0x67b725d7e342d7B611fa85e859Df9697D9378B2e.png',
  } as Token,
  ape: {
    symbol: 'APE',
    decimals: 18,
    address: '0xC762043E211571eB34f1ef377e5e8e76914962f9',
    asset:
      'https://tokens.pancakeswap.finance/images/0xC762043E211571eB34f1ef377e5e8e76914962f9.png',
  } as Token,
  jasmy: {
    symbol: 'JASMY',
    decimals: 18,
    address: '0x15669CF161946C09a8B207650BfBB00e3d8A2E3E',
    asset:
      'https://tokens.pancakeswap.finance/images/0x15669CF161946C09a8B207650BfBB00e3d8A2E3E.png',
  } as Token,
  mana: {
    symbol: 'MANA',
    decimals: 18,
    address: '0x26433c8127d9b4e9B71Eaa15111DF99Ea2EeB2f8',
    asset:
      'https://tokens.pancakeswap.finance/images/0x26433c8127d9b4e9B71Eaa15111DF99Ea2EeB2f8.png',
  } as Token,
  vet: {
    symbol: 'VET',
    decimals: 18,
    address: '0x6FDcdfef7c496407cCb0cEC90f9C5Aaa1Cc8D888',
    asset:
      'https://tokens.pancakeswap.finance/images/0x6FDcdfef7c496407cCb0cEC90f9C5Aaa1Cc8D888.png',
  } as Token,
  people: {
    symbol: 'PEOPLE',
    decimals: 18,
    address: '0x2c44b726ADF1963cA47Af88B284C06f30380fC78',
    asset:
      'https://tokens.pancakeswap.finance/images/0x2c44b726ADF1963cA47Af88B284C06f30380fC78.png',
  } as Token,
  mbl: {
    symbol: 'MBL',
    decimals: 18,
    address: '0x18E37F96628dB3037d633FE4D469Fb1933a63C5B',
    asset:
      'https://tokens.pancakeswap.finance/images/0x18E37F96628dB3037d633FE4D469Fb1933a63C5B.png',
  } as Token,
  looks: {
    symbol: 'LOOKS',
    decimals: 18,
    address: '0x590D11c0696b0023176f5D7587d6b2f502a08047',
    asset:
      'https://tokens.pancakeswap.finance/images/0x590D11c0696b0023176f5D7587d6b2f502a08047.png',
  } as Token,
  elon: {
    symbol: 'ELON',
    decimals: 18,
    address: '0x7bd6FaBD64813c48545C9c0e312A0099d9be2540',
    asset:
      'https://tokens.pancakeswap.finance/images/0x7bd6FaBD64813c48545C9c0e312A0099d9be2540.png',
  } as Token,
  gal: {
    symbol: 'GAL',
    decimals: 18,
    address: '0xe4Cc45Bb5DBDA06dB6183E8bf016569f40497Aa5',
    asset:
      'https://tokens.pancakeswap.finance/images/0xe4Cc45Bb5DBDA06dB6183E8bf016569f40497Aa5.png',
  } as Token,
  xcn: {
    symbol: 'XCN',
    decimals: 18,
    address: '0x7324c7C0d95CEBC73eEa7E85CbAac0dBdf88a05b',
    asset:
      'https://tokens.pancakeswap.finance/images/0x7324c7C0d95CEBC73eEa7E85CbAac0dBdf88a05b.png',
  } as Token,
  metis: {
    symbol: 'Metis',
    decimals: 18,
    address: '0xe552Fb52a4F19e44ef5A967632DBc320B0820639',
    asset:
      'https://tokens.pancakeswap.finance/images/0xe552Fb52a4F19e44ef5A967632DBc320B0820639.png',
  } as Token,
  peak: {
    symbol: 'PEAK',
    decimals: 8,
    address: '0x630d98424eFe0Ea27fB1b3Ab7741907DFFEaAd78',
    asset:
      'https://tokens.pancakeswap.finance/images/0x630d98424eFe0Ea27fB1b3Ab7741907DFFEaAd78.png',
  } as Token,
  nbt: {
    symbol: 'NBT',
    decimals: 18,
    address: '0x1D3437E570e93581Bd94b2fd8Fbf202d4a65654A',
    asset:
      'https://tokens.pancakeswap.finance/images/0x1D3437E570e93581Bd94b2fd8Fbf202d4a65654A.png',
  } as Token,
  trivia: {
    symbol: 'TRIVIA',
    decimals: 3,
    address: '0xb465f3cb6Aba6eE375E12918387DE1eaC2301B05',
    asset:
      'https://tokens.pancakeswap.finance/images/0xb465f3cb6Aba6eE375E12918387DE1eaC2301B05.png',
  } as Token,
  mhunt: {
    symbol: 'MHUNT',
    decimals: 18,
    address: '0x2C717059b366714d267039aF8F59125CAdce6D8c',
    asset:
      'https://tokens.pancakeswap.finance/images/0x2C717059b366714d267039aF8F59125CAdce6D8c.png',
  } as Token,
  ole: {
    symbol: 'OLE',
    decimals: 18,
    address: '0xa865197A84E780957422237B5D152772654341F3',
    asset:
      'https://tokens.pancakeswap.finance/images/0xa865197A84E780957422237B5D152772654341F3.png',
  } as Token,
  shell: {
    symbol: 'SHELL',
    decimals: 18,
    address: '0x208cfEc94d2BA8B8537da7A9BB361c6baAD77272',
    asset:
      'https://tokens.pancakeswap.finance/images/0x208cfEc94d2BA8B8537da7A9BB361c6baAD77272.png',
  } as Token,
  peel: {
    symbol: 'PEEL',
    decimals: 18,
    address: '0x734548a9e43d2D564600b1B2ed5bE9C2b911c6aB',
    asset:
      'https://tokens.pancakeswap.finance/images/0x734548a9e43d2D564600b1B2ed5bE9C2b911c6aB.png',
  } as Token,
  pstake: {
    symbol: 'PSTAKE',
    decimals: 18,
    address: '0x4C882ec256823eE773B25b414d36F92ef58a7c0C',
    asset:
      'https://tokens.pancakeswap.finance/images/0x4C882ec256823eE773B25b414d36F92ef58a7c0C.png',
  } as Token,
  stkbnb: {
    symbol: 'stkBNB',
    decimals: 18,
    address: '0xc2E9d07F66A89c44062459A47a0D2Dc038E4fb16',
    asset:
      'https://tokens.pancakeswap.finance/images/0xc2E9d07F66A89c44062459A47a0D2Dc038E4fb16.png',
  } as Token,
  wom: {
    symbol: 'WOM',
    decimals: 18,
    address: '0xAD6742A35fB341A9Cc6ad674738Dd8da98b94Fb1',
    asset:
      'https://tokens.pancakeswap.finance/images/0xAD6742A35fB341A9Cc6ad674738Dd8da98b94Fb1.png',
  } as Token,
  hay: {
    symbol: 'HAY',
    decimals: 18,
    address: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
    asset:
      'https://tokens.pancakeswap.finance/images/0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5.png',
  } as Token,
  spin: {
    symbol: 'SPIN',
    decimals: 18,
    address: '0x6AA217312960A21aDbde1478DC8cBCf828110A67',
    asset:
      'https://tokens.pancakeswap.finance/images/0x6AA217312960A21aDbde1478DC8cBCf828110A67.png',
  } as Token,
  gq: {
    symbol: 'GQ',
    decimals: 18,
    address: '0xF700D4c708C2be1463E355F337603183D20E0808',
    asset:
      'https://tokens.pancakeswap.finance/images/0xF700D4c708C2be1463E355F337603183D20E0808.png',
  } as Token,
  hoop: {
    symbol: 'HOOP',
    decimals: 18,
    address: '0xF19cfb40B3774dF6Eed83169Ad5aB0Aaf6865F25',
    asset:
      'https://tokens.pancakeswap.finance/images/0xF19cfb40B3774dF6Eed83169Ad5aB0Aaf6865F25.png',
  } as Token,
  co: {
    symbol: 'CO',
    decimals: 6,
    address: '0x936B6659Ad0C1b244Ba8Efe639092acae30dc8d6',
    asset:
      'https://tokens.pancakeswap.finance/images/0x936B6659Ad0C1b244Ba8Efe639092acae30dc8d6.png',
  } as Token,
  krs: {
    symbol: 'KRS',
    decimals: 18,
    address: '0x37b53894e7429f794B56F22a32E1695567Ee9913',
    asset:
      'https://tokens.pancakeswap.finance/images/0x37b53894e7429f794B56F22a32E1695567Ee9913.png',
  } as Token,
  wmx: {
    symbol: 'WMX',
    decimals: 18,
    address: '0xa75d9ca2a0a1D547409D82e1B06618EC284A2CeD',
    asset:
      'https://tokens.pancakeswap.finance/images/0xa75d9ca2a0a1D547409D82e1B06618EC284A2CeD.png',
  } as Token,
  mgp: {
    symbol: 'MGP',
    decimals: 18,
    address: '0xD06716E1Ff2E492Cc5034c2E81805562dd3b45fa',
    asset:
      'https://tokens.pancakeswap.finance/images/0xD06716E1Ff2E492Cc5034c2E81805562dd3b45fa.png',
  } as Token,
  hook: {
    symbol: 'HOOK',
    decimals: 18,
    address: '0xa260E12d2B924cb899AE80BB58123ac3fEE1E2F0',
    asset:
      'https://tokens.pancakeswap.finance/images/0xa260E12d2B924cb899AE80BB58123ac3fEE1E2F0.png',
  } as Token,
  hft: {
    symbol: 'HFT',
    decimals: 18,
    address: '0x44Ec807ce2F4a6F2737A92e985f318d035883e47',
    asset:
      'https://tokens.pancakeswap.finance/images/0x44Ec807ce2F4a6F2737A92e985f318d035883e47.png',
  } as Token,
  squad: {
    symbol: 'SQUAD',
    decimals: 18,
    address: '0x724A32dFFF9769A0a0e1F0515c0012d1fB14c3bd',
    asset:
      'https://tokens.pancakeswap.finance/images/0x724A32dFFF9769A0a0e1F0515c0012d1fB14c3bd.png',
  } as Token,
  zbc: {
    symbol: 'ZBC',
    decimals: 9,
    address: '0x37a56cdcD83Dce2868f721De58cB3830C44C6303',
    asset:
      'https://tokens.pancakeswap.finance/images/0x37a56cdcD83Dce2868f721De58cB3830C44C6303.png',
  } as Token,
  primal: {
    symbol: 'PRIMAL',
    decimals: 18,
    address: '0xCb5327Ed4649548e0d73E70b633cdfd99aF6Da87',
    asset:
      'https://tokens.pancakeswap.finance/images/0xCb5327Ed4649548e0d73E70b633cdfd99aF6Da87.png',
  } as Token,
  ...MAINNET_TOKENS,
};
