export const getTokenPublicUrl = (filePath: string) => `/coins/${filePath}`;

export const tokenIconUrls = {
  UNI: getTokenPublicUrl('uni.svg'),
  XVS: getTokenPublicUrl('xvs.svg'),
  DOT: getTokenPublicUrl('dot.svg'),
  AAVE: getTokenPublicUrl('aave.svg'),
  SXP: getTokenPublicUrl('sxp.svg'),
  DAI: getTokenPublicUrl('dai.svg'),
  LTC: getTokenPublicUrl('ltc.svg'),
  BCH: getTokenPublicUrl('bch.svg'),
  MATIC: getTokenPublicUrl('matic.svg'),
  TRX: getTokenPublicUrl('trx.svg'),
  TRXOLD: getTokenPublicUrl('trx.svg'),
  LINK: getTokenPublicUrl('link.svg'),
  wBETH: getTokenPublicUrl('wbeth.svg'),
  UST: getTokenPublicUrl('ust.svg'),
  BTCB: getTokenPublicUrl('btcb.svg'),
  BUSD: getTokenPublicUrl('busd.svg'),
  BETH: getTokenPublicUrl('beth.svg'),
  ADA: getTokenPublicUrl('ada.svg'),
  XRP: getTokenPublicUrl('xrp.svg'),
  TUSD: getTokenPublicUrl('tusd.svg'),
  TUSDOLD: getTokenPublicUrl('tusd.svg'),
  LUNA: getTokenPublicUrl('luna.svg'),
  DOGE: getTokenPublicUrl('doge.svg'),
  USDC: getTokenPublicUrl('usdc.svg'),
  ETH: getTokenPublicUrl('eth.svg'),
  FIL: getTokenPublicUrl('fil.svg'),
  USDT: getTokenPublicUrl('usdt.svg'),
  Cake: getTokenPublicUrl('cake.svg'),
  BNB: getTokenPublicUrl('bnb.svg'),
};

export const bscMainnetVCanAddress = '0xeBD0070237a0713E8D94fEf1B728d3d993d290ef';

export const compoundDecimals = 18;

export const vTokenDecimals = 8;
