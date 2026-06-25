import { endOfMonth, subHours } from 'date-fns';

import { Card, Page, Spinner } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';

import { EndOfCycle } from './EndOfCycle';
import { Hero } from './Hero';
import { RankSection } from './RankSection';
import { RankTable } from './RankTable';
import { RewardTable } from './RewardTable';
import { TotalRewardsSection } from './TotalRewardsSection';
import { UserRewardsSection } from './UserRewardsSection';

// TODO: use the cycle end date returned by the API
const endOfCycleDate = endOfMonth(new Date());

// TODO: use the indexer's last refresh time returned by the API
const lastRefreshedAt = subHours(new Date(), 6);

const PrimeLeaderboard: React.FC = () => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();

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

      {endOfCycleDate ? (
        <EndOfCycle
          endDate={endOfCycleDate}
          className="relative mx-auto mt-8 w-full max-w-[467px]"
        />
      ) : (
        <Spinner className="relative mx-auto mt-8" />
      )}

      <p className="relative mt-4 text-right text-b2s text-light-grey">
        {t('primeLeaderboard.tablesRefreshNote', { date: lastRefreshedAt })}
      </p>

      <div className="relative mt-3 flex flex-col gap-3 lg:flex-row">
        <Card className="flex flex-col gap-2.5 border-dark-grey bg-background p-3 lg:grow">
          {accountAddress ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <TotalRewardsSection />

              <UserRewardsSection />
            </div>
          ) : (
            <TotalRewardsSection />
          )}

          <RewardTable />
        </Card>

        <Card className="flex flex-col gap-2.5 border-dark-grey bg-background p-3 lg:w-107 lg:shrink-0">
          <RankSection />

          <RankTable />
        </Card>
      </div>
    </Page>
  );
};

export default PrimeLeaderboard;
