import { BigNumber } from 'bignumber.js';

import { TESTNET_TOKENS } from 'constants/tokens';

import { PendingRewardGroup } from '../types';

export const fakePendingRewardGroups: PendingRewardGroup[] = [
  {
    groupName: 'Venus pool',
    pendingRewardTokens: [
      {
        token: TESTNET_TOKENS.xvs,
        amountCents: 4578,
        pendingRewards: [
          {
            rewardToken: TESTNET_TOKENS.xvs,
            amountWei: new BigNumber('10000001234210000000'),
          },
        ],
      },
      {
        token: TESTNET_TOKENS.sxp,
        amountCents: 4578,
        pendingRewards: [
          {
            rewardToken: TESTNET_TOKENS.xvs,
            amountWei: new BigNumber('10000001234210000000'),
          },
        ],
      },
    ],
  },
  {
    groupName: 'Premium partner pool',
    pendingRewardTokens: [
      {
        token: TESTNET_TOKENS.usdt,
        amountCents: 4578,
        pendingRewards: [
          {
            rewardToken: TESTNET_TOKENS.xvs,
            amountWei: new BigNumber('10000001234210000000'),
          },
          {
            rewardToken: TESTNET_TOKENS.bnb,
            amountWei: new BigNumber('10000001234210000000'),
          },
        ],
      },
    ],
  },
  {
    groupName: 'Vaults',
    pendingRewardTokens: [
      {
        token: TESTNET_TOKENS.vai,
        amountCents: 4578,
        pendingRewards: [
          {
            rewardToken: TESTNET_TOKENS.vai,
            amountWei: new BigNumber('10000001234210000000'),
          },
        ],
      },
      {
        token: TESTNET_TOKENS.xvs,
        amountCents: 4578,
        pendingRewards: [
          {
            rewardToken: TESTNET_TOKENS.xvs,
            amountWei: new BigNumber('10000001234210000000'),
          },
        ],
      },
      {
        token: TESTNET_TOKENS.vrt,
        amountCents: 4578,
        pendingRewards: [
          {
            rewardToken: TESTNET_TOKENS.xvs,
            amountWei: new BigNumber('10000001234210000000'),
          },
        ],
      },
    ],
  },
];
