import type { DisabledTokenAction } from '../../types';

export const disabledTokenActions: DisabledTokenAction[] = [
  {
    address: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    disabledActions: ['boost', 'repayWithCollateral', 'swapAndSupply', 'swapAndRepay'],
  },
  {
    address: '0x86e06EAfa6A1eA631Eab51DE500E3D474933739f',
    disabledActions: ['borrow', 'supply', 'boost', 'swapAndSupply'],
  },
  {
    address: '0x6d3BD68E90B42615cb5abF4B8DE92b154ADc435e', // PT-clisBNBx-25JUN2026
    disabledActions: ['swapAndSupply', 'swapAndRepay', 'boost'],
  },
];
