import { Card, Page } from 'components';

import { EndOfCycle } from './EndOfCycle';
import { Hero } from './Hero';
import { RankSection } from './RankSection';
import { RankTable } from './RankTable';
import { RewardTable } from './RewardTable';
import { TotalRewardsCard } from './TotalRewardsCard';
import { UserRewardsCard } from './UserRewardsCard';

const PrimeLeaderboard: React.FC = () => (
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TotalRewardsCard />

          <UserRewardsCard />
        </div>

        <RewardTable />
      </Card>

      <Card className="flex flex-col gap-2.5 border-dark-grey bg-background p-3 lg:w-107 lg:shrink-0">
        <RankSection />

        <RankTable />
      </Card>
    </div>
  </Page>
);

export default PrimeLeaderboard;
