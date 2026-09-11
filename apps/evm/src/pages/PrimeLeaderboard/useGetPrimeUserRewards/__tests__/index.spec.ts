import fakeAccountAddress from '__mocks__/models/address';
import { usdt } from '__mocks__/models/tokens';
import { useGetPrimeUserPendingRewards } from 'clients/api';
import { renderHook } from 'testUtils/render';
import type { Mock } from 'vitest';

import { useGetPrimeUserRewards } from '..';

const fakeMarketAddress = '0xfD5840Cd36d94D7229439859C0112a4185BC0255';
const fakeOtherMarketAddress = '0x6bCa74586218dB34cdB402295796b79663d816e9';

const EMITTING_SPEED_MANTISSA = '11111111111111111';
const ACTIVE_MULTIPLIER_MANTISSA = '2000000000000000000';
// $1 and $380.27 expressed as 18-decimal USD mantissas
const ONE_DOLLAR_MANTISSA = '1000000000000000000';
const ACCRUED_MANTISSA = '380270000000000000000';

interface FakeReward {
  marketAddress: string;
  rewardTokenAddress: string;
  currentCycleUsdMantissa: string;
  tokenDistributionSpeedMantissa?: string;
  supplyMultiplierMantissa?: string;
  borrowMultiplierMantissa?: string;
}

const mockApi = (rewards: FakeReward[]) => {
  (useGetPrimeUserPendingRewards as Mock).mockReturnValue({
    data: {
      totalCurrentCycleUsdMantissa: ONE_DOLLAR_MANTISSA,
      rewards,
    },
    isLoading: false,
  });
};

describe('pages/PrimeLeaderboard/useGetPrimeUserRewards', () => {
  it.each([
    {
      name: 'supply side only',
      tokenDistributionSpeedMantissa: EMITTING_SPEED_MANTISSA,
      supplyMultiplierMantissa: ACTIVE_MULTIPLIER_MANTISSA,
      borrowMultiplierMantissa: '0',
      currentCycleUsdMantissa: ONE_DOLLAR_MANTISSA,
      expectedSide: 'supply',
    },
    {
      name: 'borrow side only',
      tokenDistributionSpeedMantissa: EMITTING_SPEED_MANTISSA,
      supplyMultiplierMantissa: '0',
      borrowMultiplierMantissa: ACTIVE_MULTIPLIER_MANTISSA,
      currentCycleUsdMantissa: ONE_DOLLAR_MANTISSA,
      expectedSide: 'borrow',
    },
    {
      name: 'both sides',
      tokenDistributionSpeedMantissa: EMITTING_SPEED_MANTISSA,
      supplyMultiplierMantissa: ACTIVE_MULTIPLIER_MANTISSA,
      borrowMultiplierMantissa: ACTIVE_MULTIPLIER_MANTISSA,
      currentCycleUsdMantissa: ONE_DOLLAR_MANTISSA,
      expectedSide: 'both',
    },
    {
      name: 'emissions stopped but a balance is still accrued',
      tokenDistributionSpeedMantissa: '0',
      supplyMultiplierMantissa: ACTIVE_MULTIPLIER_MANTISSA,
      borrowMultiplierMantissa: '0',
      currentCycleUsdMantissa: ACCRUED_MANTISSA,
      expectedSide: 'supply',
    },
    {
      name: 'the emission config is not served yet',
      tokenDistributionSpeedMantissa: undefined,
      supplyMultiplierMantissa: undefined,
      borrowMultiplierMantissa: undefined,
      currentCycleUsdMantissa: ONE_DOLLAR_MANTISSA,
      expectedSide: undefined,
    },
  ])('renders the market with side "$expectedSide" when $name', ({ expectedSide, ...reward }) => {
    mockApi([{ marketAddress: fakeMarketAddress, rewardTokenAddress: usdt.address, ...reward }]);

    const { result } = renderHook(() => useGetPrimeUserRewards(), {
      accountAddress: fakeAccountAddress,
    });

    expect(result.current.marketRewards).toHaveLength(1);
    expect(result.current.marketRewards[0].marketAddress).toBe(fakeMarketAddress);
    expect(result.current.marketRewards[0].side).toBe(expectedSide);
  });

  it('keeps one row per market when a reward token incentivizes several markets', () => {
    mockApi([
      {
        marketAddress: fakeMarketAddress,
        rewardTokenAddress: usdt.address,
        currentCycleUsdMantissa: ONE_DOLLAR_MANTISSA,
        tokenDistributionSpeedMantissa: EMITTING_SPEED_MANTISSA,
        supplyMultiplierMantissa: ACTIVE_MULTIPLIER_MANTISSA,
        borrowMultiplierMantissa: '0',
      },
      {
        marketAddress: fakeOtherMarketAddress,
        rewardTokenAddress: usdt.address,
        currentCycleUsdMantissa: ACCRUED_MANTISSA,
        tokenDistributionSpeedMantissa: EMITTING_SPEED_MANTISSA,
        supplyMultiplierMantissa: '0',
        borrowMultiplierMantissa: ACTIVE_MULTIPLIER_MANTISSA,
      },
    ]);

    const { result } = renderHook(() => useGetPrimeUserRewards(), {
      accountAddress: fakeAccountAddress,
    });

    expect(
      result.current.marketRewards.map(({ marketAddress, side, rewardsCents }) => ({
        marketAddress,
        side,
        rewardsCents,
      })),
    ).toEqual([
      { marketAddress: fakeMarketAddress, side: 'supply', rewardsCents: 100 },
      { marketAddress: fakeOtherMarketAddress, side: 'borrow', rewardsCents: 38027 },
    ]);
  });
});
