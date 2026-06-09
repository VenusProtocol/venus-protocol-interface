import BigNumber from 'bignumber.js';

import { usdc, vai, xvs } from '__mocks__/models/tokens';

import { calculateVaultAprPercentage } from '..';

describe('calculateVaultAprPercentage', () => {
  it('calculates APR from emission and stake values', () => {
    const stakeAprPercentage = calculateVaultAprPercentage({
      dailyEmissionMantissa: new BigNumber('144000000000000000000'),
      rewardToken: xvs,
      rewardTokenPriceCents: new BigNumber(100),
      stakeBalanceMantissa: new BigNumber('415000000000000000000'),
      stakedToken: vai,
      stakedTokenPriceCents: new BigNumber(100),
    });

    expect(stakeAprPercentage).toBe(12665.060240963856);
  });

  it('normalizes token decimals before comparing reward and stake values', () => {
    const stakeAprPercentage = calculateVaultAprPercentage({
      dailyEmissionMantissa: new BigNumber('1000000000000000000'),
      rewardToken: xvs,
      rewardTokenPriceCents: new BigNumber(2000),
      stakeBalanceMantissa: new BigNumber('1000000000'),
      stakedToken: usdc,
      stakedTokenPriceCents: new BigNumber(100),
    });

    expect(stakeAprPercentage).toBe(730);
  });

  it('returns 0 when the total staked balance is 0', () => {
    const stakeAprPercentage = calculateVaultAprPercentage({
      dailyEmissionMantissa: new BigNumber('1000000000000000000'),
      rewardToken: xvs,
      rewardTokenPriceCents: new BigNumber(2000),
      stakeBalanceMantissa: new BigNumber(0),
      stakedToken: usdc,
      stakedTokenPriceCents: new BigNumber(100),
    });

    expect(stakeAprPercentage).toBe(0);
  });
});
