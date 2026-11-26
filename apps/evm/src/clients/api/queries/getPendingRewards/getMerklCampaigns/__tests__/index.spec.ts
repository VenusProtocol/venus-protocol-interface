import type { LiquidityHub, MerklDistribution, Pool, SpokePool } from 'types';
import type { Address } from 'viem';
import { getMerklCampaigns } from '..';
import { fakeMerklCampaigns } from '../../__testUtils__/fakeData';

const fakeComptrollerAddress = '0x1000000000000000000000000000000000000001' as const;
const fakeMarketAddress = '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7' as const;
const fakeLiquidityHubAddress = '0x2000000000000000000000000000000000000001' as const;
const fakeResourceAddress = '0x3000000000000000000000000000000000000001' as const;
const fakeSpokeComptrollerAddress = '0x4000000000000000000000000000000000000001' as const;
const fakeSpokeMarketAddress = '0x5000000000000000000000000000000000000001' as const;

const marketMerklCampaign = fakeMerklCampaigns[fakeMarketAddress][0];

const getFakeMerklCampaign = ({
  marketAddress,
}: { marketAddress: Address }): MerklDistribution => ({
  ...marketMerklCampaign,
  rewardDetails: {
    ...marketMerklCampaign.rewardDetails,
    marketAddress,
  },
});

describe('getMerklCampaigns', () => {
  it('includes market and liquidity hub Merkl campaigns, ignoring liquidity hub source campaigns', () => {
    const liquidityHubMerklCampaign = getFakeMerklCampaign({ marketAddress: fakeResourceAddress });
    const sourceMerklCampaign = getFakeMerklCampaign({ marketAddress: fakeResourceAddress });

    const pool = {
      isIsolated: true,
      comptrollerAddress: fakeComptrollerAddress,
      assets: [
        {
          vToken: {
            address: fakeMarketAddress,
          },
          supplyTokenDistributions: [marketMerklCampaign],
          borrowTokenDistributions: [],
        },
      ],
    } as unknown as Pool;

    const liquidityHub = {
      vhToken: {
        address: fakeLiquidityHubAddress,
      },
      supplyTokenDistributions: [liquidityHubMerklCampaign],
      yieldGroups: [
        {
          sources: [
            {
              address: fakeResourceAddress,
              supplyTokenDistributions: [sourceMerklCampaign],
            },
          ],
        },
      ],
    } as unknown as LiquidityHub;

    const { isolatedPoolComptrollerAddresses, merklCampaigns } = getMerklCampaigns({
      pools: [pool],
      liquidityHubs: [liquidityHub],
    });

    expect(isolatedPoolComptrollerAddresses).toEqual([fakeComptrollerAddress]);
    expect(merklCampaigns[fakeMarketAddress]).toEqual([marketMerklCampaign]);
    expect(merklCampaigns[fakeLiquidityHubAddress]).toHaveLength(1);
    expect(merklCampaigns[fakeLiquidityHubAddress][0].rewardDetails.marketAddress).toBe(
      fakeLiquidityHubAddress,
    );
    expect(merklCampaigns[fakeResourceAddress]).toBeUndefined();
  });

  it('includes Spoke borrow Merkl campaigns without treating Spoke pools as isolated pools', () => {
    const spokeMerklCampaign = getFakeMerklCampaign({ marketAddress: fakeSpokeMarketAddress });

    const spokePool = {
      comptrollerAddress: fakeSpokeComptrollerAddress,
      assets: [
        {
          vToken: {
            address: fakeSpokeMarketAddress,
          },
          supplyTokenDistributions: [],
          borrowTokenDistributions: [spokeMerklCampaign],
        },
      ],
    } as unknown as SpokePool;

    const { isolatedPoolComptrollerAddresses, merklCampaigns } = getMerklCampaigns({
      spokePools: [spokePool],
    });

    expect(isolatedPoolComptrollerAddresses).toEqual([]);
    expect(merklCampaigns[fakeSpokeMarketAddress]).toEqual([spokeMerklCampaign]);
  });
});
