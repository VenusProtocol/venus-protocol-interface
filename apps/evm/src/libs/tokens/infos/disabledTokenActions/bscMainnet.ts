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
  {
    address: '0x18AfDACF30F8671021dec4b78297E39d2FE87226', // vhUSDT
    disabledActions: ['swapAndSupply'],
  },
  {
    address: '0x9D2D9592cF8DFbf59107fAab703d08494BE14617', // vhUSDC
    disabledActions: ['swapAndSupply'],
  },
  {
    address: '0x0e5AA174d4F31b757a237eb1999DE151596788B0', // vhU
    disabledActions: ['swapAndSupply'],
  },
];
