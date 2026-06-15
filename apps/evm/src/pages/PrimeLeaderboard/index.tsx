import { Card, Page } from 'components';
import { useGetTokens } from 'libs/tokens';
import { useAccountAddress, useAuthModal } from 'libs/wallet';

import { EndOfCycle } from './EndOfCycle';
import { Hero } from './Hero';
import { type PrimeRankData, RankCard } from './RankCard';
import { RankTable } from './RankTable';
import { RewardTable } from './RewardTable';
import { TotalRewardsCard } from './TotalRewardsCard';
import { UserRewardsCard } from './UserRewardsCard';

// TODO: use the reward pool data returned by the API
const placeholderTotalRewardsCents = 46_230_000;
const placeholderUserRewardsCents = 1_840_000;
const placeholderMarketRewardsCents = [28_040_000, 17_190_000];
const placeholderApyPercentage = 3.78;

// TODO: replace this placeholder with the rank data returned by the API
const placeholderRankData: PrimeRankData = {
  hasStakedXvs: true,
  isCandidate: true,
  isPrime: true,
  hasSupplied: true,
  rank: 2,
  primeScore: 542_500_000,
  gapXvsTokens: 5_432,
};

const PrimeLeaderboard: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { openAuthModal } = useAuthModal();
  const tokens = useGetTokens();

  // TODO: replace these placeholder tokens (currently the first tokens from the list, unrelated
  // to the actual Prime reward markets) with the real markets returned by the API
  const marketRewards = tokens
    .slice(0, placeholderMarketRewardsCents.length)
    .map((token, index) => ({ token, rewardsCents: placeholderMarketRewardsCents[index] }));

  const userMarketRewards = marketRewards.map(reward => ({
    ...reward,
    apyPercentage: placeholderApyPercentage,
  }));

  const totalRewardsCard = (
    <TotalRewardsCard
      totalRewardsCents={placeholderTotalRewardsCents}
      marketRewards={marketRewards}
    />
  );

  return (
    <Page>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 w-screen -translate-x-1/2"
      >
        <div className="absolute inset-x-0 -top-40 flex justify-center">
          <div className="h-200 w-200 rounded-full bg-blue/30 blur-3xl" />
        </div>
      </div>

      <Hero />

      <EndOfCycle className="relative mx-auto mt-8 w-full max-w-140" />

      <p className="relative mt-4 text-right text-b2s text-light-grey">
        Refreshed daily · Last refresh: 6h ago
      </p>

      <div className="relative mt-3 flex flex-col gap-3 lg:flex-row">
        <Card className="flex flex-col gap-2.5 border-dark-grey bg-background p-3 lg:grow">
          {accountAddress ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {totalRewardsCard}

              <UserRewardsCard
                totalRewardsCents={placeholderUserRewardsCents}
                marketRewards={userMarketRewards}
              />
            </div>
          ) : (
            totalRewardsCard
          )}

          <RewardTable />
        </Card>

        <Card className="flex flex-col gap-2.5 border-dark-grey bg-background p-3 lg:w-107 lg:shrink-0">
          <RankCard
            isUserConnected={!!accountAddress}
            onConnect={() => openAuthModal({ analyticVariant: 'primeLeaderboardRankCard' })}
            rankData={placeholderRankData}
          />

          <RankTable />
        </Card>
      </div>
    </Page>
  );
};

export default PrimeLeaderboard;
