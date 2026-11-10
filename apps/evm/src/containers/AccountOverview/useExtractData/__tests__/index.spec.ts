import BigNumber from 'bignumber.js';

import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { poolData } from '__mocks__/models/pools';
import { tradePositions } from '__mocks__/models/trade';
import { institutionalVault, pendleVault, vaults } from '__mocks__/models/vaults';
import type { Pool } from 'types';
import { calculateDailyInterests } from 'utilities';

import { useExtractData } from '..';

const pool: Pool = {
  ...poolData[0],
  userSupplyBalanceCents: new BigNumber(100000),
  userYearlyEarningsCents: new BigNumber(5000),
};

describe('useExtractData', () => {
  it('returns the net APY and daily earnings of the Core pool alone', () => {
    const result = useExtractData({ pool });

    expect(result.userNetApyPercentage).toBe(5);
    expect(result.userDailyEarningsCents).toEqual(calculateDailyInterests(new BigNumber(5000)));
    expect(result.userTotalVaultStakeCents).toBeUndefined();
  });

  it('includes Liquidity Hub positions in the net yield and the total supply', () => {
    const result = useExtractData({
      pool,
      liquidityHubs: [
        {
          ...liquidityHubs[0],
          userVhTokenBalanceCents: new BigNumber(100000),
          userSupplyBalanceCents: new BigNumber(100000),
          userYearlyEarningsCents: new BigNumber(15000),
        },
      ],
    });

    expect(result.userNetApyPercentage).toBe(10);
  });

  it('leaves out the yield of Liquidity Hub shares supplied to the Core pool', () => {
    const result = useExtractData({
      pool,
      liquidityHubs: [
        {
          ...liquidityHubs[0],
          userVhTokenBalanceCents: new BigNumber(0),
          userSupplyBalanceCents: new BigNumber(100000),
          userYearlyEarningsCents: new BigNumber(15000),
        },
      ],
    });

    expect(result.userNetApyPercentage).toBe(5);
    expect(result.userDailyEarningsCents).toEqual(calculateDailyInterests(new BigNumber(5000)));
  });

  it('counts the yield of the Liquidity Hub shares held in the wallet only', () => {
    const result = useExtractData({
      pool,
      liquidityHubs: [
        {
          ...liquidityHubs[0],
          userVhTokenBalanceCents: new BigNumber(100000),
          userSupplyBalanceCents: new BigNumber(200000),
          userYearlyEarningsCents: new BigNumber(30000),
        },
      ],
    });

    expect(result.userNetApyPercentage).toBe(10);
  });

  it('values every vault with its own stake balance and leaves Pendle vaults out of the net APY', () => {
    const result = useExtractData({
      pool,
      vaults: [
        { ...vaults[0], userStakeBalanceCents: 100000, stakeAprPercentage: 15 },
        { ...institutionalVault, userStakeBalanceCents: 200000, stakeAprPercentage: 10 },
        { ...pendleVault, userStakeBalanceCents: 300000, stakeAprPercentage: 50 },
      ],
    });

    expect(result.userNetApyPercentage).toBe(10);
    expect(result.userTotalVaultStakeCents?.toNumber()).toBe(600000);
  });

  it('includes Trade positions using their supplied value and net APY', () => {
    const result = useExtractData({
      pool,
      tradePositions: [
        {
          ...tradePositions[0],
          dsaBalanceCents: 40000,
          longBalanceCents: 60000,
          netApyPercentage: -5,
        },
      ],
    });

    expect(result.userNetApyPercentage).toBe(0);
  });
});
