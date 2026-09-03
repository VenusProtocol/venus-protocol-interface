import type { DisabledTokenAction } from '../../types';

export const disabledTokenActions: DisabledTokenAction[] = [
  {
    address: '0x7cE6ADF754D0eC81A6CF8ACd9C7454F45077dc61', // vSHARE
    disabledActions: ['swapAndSupply'],
  },
  {
    address: '0x1fdD7eAFC771DA154B67Ca372FB80Ff78D7774D2', // vhTUSD
    disabledActions: ['swapAndSupply'],
  },
];
