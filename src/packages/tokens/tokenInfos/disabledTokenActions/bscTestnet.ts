import { DisabledTokenAction } from '../../types';

export const disabledTokenActions: DisabledTokenAction[] = [
  {
    // BUSD
    address: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // UST
    address: '0x5A79efD958432E72211ee73D5DDFa9bc8f248b5F',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // LUNA
    address: '0xf36160EC62E3B191EA375dadfe465E8Fa1F8CabB',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // SXP
    address: '0x75107940Cf1121232C0559c747A986DEfbc69DA9',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // TRXOLD
    address: '0x19E7215abF8B2716EE807c9f4b83Af0e7f92653F',
    disabledActions: ['borrow', 'supply'],
  },
  {
    // TUSDOLD
    address: '0xFeC3A63401Eb9C1476200d7C32c4009Be0154169',
    disabledActions: ['borrow', 'supply'],
  },
];
