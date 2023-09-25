import { DisabledTokenAction } from '../../types';

export const disabledTokenActions: DisabledTokenAction[] = [
  {
    // BUSD
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // UST
    address: '0x3d4350cD54aeF9f9b2C29435e0fa809957B3F30a',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // LUNA
    address: '0x156ab3346823B651294766e23e6Cf87254d68962',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // SXP
    address: '0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // TRXOLD
    address: '0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // TUSDOLD
    address: '0x14016e85a25aeb13065688cafb43044c2ef86784',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // BETH
    address: '0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B',
    disabledActions: ['borrow'],
  },
];
