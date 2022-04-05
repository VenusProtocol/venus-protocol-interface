import BigNumber from 'bignumber.js';

export const assetData = [
  {
    id: '1',
    address: '1',
    symbol: 'xvs',
    borrowApy: new BigNumber('3.14'),
    liquidity: new BigNumber('2151232133213'),
    tokenPrice: new BigNumber(123),
    borrowBalance: new BigNumber('123'),
    decimals: 18,
    name: 'XVS',
    walletBalance: new BigNumber('444'),
    isEnabled: true,
    vtokenAddress: '0x123',
    xvsBorrowApy: new BigNumber(0.5),
    img: '',
    borrowCaps: new BigNumber(0.5),
    totalBorrows: new BigNumber(0.5),
    xvsSupplyApy: new BigNumber(0.5),
    supplyApy: new BigNumber(0.5),
    collateralFactor: new BigNumber(0.5),
    collateral: true,
    supplyBalance: new BigNumber(5522234),
    key: 0,
    percentOfLimit: '',
    tokenAddress: '',
    treasuryBalance: new BigNumber('5553322'),
    vimg: undefined,
    vsymbol: 'vXVS',
  },
  {
    id: '2',
    address: '2',
    symbol: 'usdc',
    borrowApy: new BigNumber('0.14'),
    liquidity: new BigNumber('2158192683'),
    tokenPrice: new BigNumber(123333),
    borrowBalance: new BigNumber('12333'),
    decimals: 18,
    name: 'usdc',
    walletBalance: new BigNumber('444'),
    isEnabled: true,
    vtokenAddress: '0x123',
    xvsBorrowApy: new BigNumber(5),
    img: '',
    borrowCaps: new BigNumber(5),
    totalBorrows: new BigNumber(5),
    xvsSupplyApy: new BigNumber(5),
    supplyApy: new BigNumber(5),
    collateralFactor: new BigNumber(5),
    collateral: true,
    supplyBalance: new BigNumber(5522234),
    key: 1,
    percentOfLimit: '',
    tokenAddress: '',
    treasuryBalance: new BigNumber('5553322'),
    vimg: undefined,
    vsymbol: 'vUSDC',
  },
  {
    id: '3',
    address: '3',
    symbol: 'bnb',
    borrowApy: new BigNumber('8.14'),
    liquidity: new BigNumber('918723'),
    tokenPrice: new BigNumber(123),
    borrowBalance: new BigNumber('13323'),
    decimals: 18,
    name: 'bnb',
    walletBalance: new BigNumber('444'),
    isEnabled: true,
    vtokenAddress: '0x123',
    xvsBorrowApy: new BigNumber(15),
    img: '',
    borrowCaps: new BigNumber(115),
    totalBorrows: new BigNumber(445),
    xvsSupplyApy: new BigNumber(45),
    supplyApy: new BigNumber(45),
    collateralFactor: new BigNumber(45),
    collateral: true,
    supplyBalance: new BigNumber(5522234),
    key: 2,
    percentOfLimit: '',
    tokenAddress: '',
    treasuryBalance: new BigNumber('5553322'),
    vimg: undefined,
    vsymbol: 'vBNB',
  },
];
