import { BigNumber as BN } from 'ethers';

export const fakeGetPriceOutput = BN.from('0x30f7dc8a6370b000');

export const fakeGetPendingXvsOutput = BN.from('1000000000000000000');

export const fakeGetIsolatedPoolPendingRewardsOutput = [
  {
    distributorAddress: '0xb0269d68CfdCc30Cb7Cd2E0b52b08Fa7Ffd3079b',
    rewardTokenAddress: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
    pendingRewards: [
      {
        vTokenAddress: '0x170d3b2da05cc2124334240fB34ad1359e34C562',
        amount: BN.from('0'),
      },
    ],
    totalRewards: BN.from('0'),
  },
  {
    distributorAddress: '0x2aBEf3602B688493fe698EF11D27DCa43a0CE4BE',
    rewardTokenAddress: '0xe73774DfCD551BF75650772dC2cC56a2B6323453',
    pendingRewards: [
      {
        vTokenAddress: '0x170d3b2da05cc2124334240fB34ad1359e34C562',
        amount: BN.from('100000'),
      },
      {
        vTokenAddress: '0x3338988d0beb4419Acb8fE624218754053362D06',
        amount: BN.from('10000'),
      },
    ],
    totalRewards: BN.from('0'),
  },
];

export const fakeGetMainPoolPendingRewardsOutput = {
  distributorAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
  rewardTokenAddress: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
  pendingRewards: [
    {
      vTokenAddress: '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
      amount: BN.from('0x03227eb22e'),
    },
    {
      vTokenAddress: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      amount: BN.from('0x03a79249a7ab84cb9b1a'),
    },
  ],
  totalRewards: BN.from('0x7b5efdaddfe5ca6b83'),
};

export const fakeGetXvsVaultPoolInfosOutput = {
  allocPoint: BN.from('0x64'),
  accRewardPerShare: BN.from('0x488db67c0fc8'),
  lastRewardBlock: BN.from('0x01fbbe36'),
  lockPeriod: BN.from('0x012c'),
  token: '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
};

export const fakeGetXvsVaultPendingRewardOutput = BN.from('0x08f4371102fe1040');

export const fakeGetXvsVaultPendingWithdrawalsBeforeUpgradeOutput = BN.from('0');

export const fakeGetPrimePendingRewardsOutput = [
  {
    amount: BN.from('0x03227eb22e'),
    rewardToken: '0xe73774DfCD551BF75650772dC2cC56a2B6323453',
    vToken: '0x162D005F0Fff510E54958Cfc5CF32A3180A84aab',
  },
  {
    amount: BN.from('0x03a79249a7ab84cb9b1a'),
    rewardToken: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
    vToken: '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
  },
];
