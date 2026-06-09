import { endOfMonth } from 'date-fns';

import { Card, Page } from 'components';
import { useTranslation } from 'libs/translations';

import { EndOfCycle } from './EndOfCycle';
import { Hero } from './Hero';
import { RankCard } from './RankCard';
import { RankTable } from './RankTable';
import { RewardTable } from './RewardTable';
import { TotalRewardsCard } from './TotalRewardsCard';
import { UserRewardsCard } from './UserRewardsCard';

// TODO: use the cycle end date returned by the API
const endOfCycleDate = endOfMonth(new Date());

// TODO: use the indexer's last refresh time returned by the API
const lastRefreshDistance = '6h';

const PrimeLeaderboard: React.FC = () => {
  const { t } = useTranslation();

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

      <EndOfCycle endDate={endOfCycleDate} className="relative mx-auto mt-8 w-full max-w-[467px]" />

      <p className="relative mt-4 text-right text-b2s text-light-grey">
        {t('primeLeaderboard.tablesRefreshNote', { distance: lastRefreshDistance })}
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
          <RankCard />

          <RankTable />
        </Card>
      </div>
    </Page>
  );
};

export default PrimeLeaderboard;
