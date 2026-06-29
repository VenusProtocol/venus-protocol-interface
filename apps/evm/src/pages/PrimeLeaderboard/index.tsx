import { useGetPrimeCurrentCycle } from 'clients/api';
import { Icon, Page, Tabs } from 'components';
import { useBreakpointUp } from 'hooks/responsive';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';

import { EndOfCycle } from './EndOfCycle';
import { Hero } from './Hero';
import { RankingPanel } from './RankingPanel';
import { RefreshNote } from './RefreshNote';
import { RewardsPanel } from './RewardsPanel';
import { useRefreshOnNewCycle } from './useRefreshOnNewCycle';

const PrimeLeaderboard: React.FC = () => {
  const { t } = useTranslation();
  const isXlUp = useBreakpointUp('xl');
  const { data: currentCycle, isLoading: isCurrentCycleLoading } = useGetPrimeCurrentCycle();

  useRefreshOnNewCycle();

  const endOfCycleDate = currentCycle?.cycle?.endsAt;
  const currentCycleIndex = currentCycle?.cycle?.cycleIndex;
  const lastCycleIndex = currentCycleIndex !== undefined ? currentCycleIndex - 1 : undefined;

  const tabs: Tab[] = [
    {
      id: 'rewards',
      title: (
        <span className="flex items-center gap-x-1">
          <Icon name="medal" className="size-5 text-inherit" />

          {t('primeLeaderboard.tabs.rewards')}
        </span>
      ),
      content: (
        <div className="space-y-3">
          <RefreshNote />

          <RewardsPanel />
        </div>
      ),
    },
    {
      id: 'ranking',
      title: (
        <span className="flex items-center gap-x-1">
          <Icon name="trophy" className="size-5 text-inherit" />

          {t('primeLeaderboard.tabs.ranking')}
        </span>
      ),
      content: (
        <div className="space-y-3">
          <RefreshNote />

          <RankingPanel />
        </div>
      ),
    },
  ];

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

      <EndOfCycle
        endDate={endOfCycleDate}
        lastCycleIndex={lastCycleIndex}
        isLoading={isCurrentCycleLoading}
        className="relative mx-auto mt-8 w-full max-w-[467px]"
      />

      {isXlUp ? (
        <div className="relative mt-10 space-y-3">
          <RefreshNote />

          <div className="flex gap-3">
            <div className="min-w-0 grow">
              <RewardsPanel />
            </div>

            <div className="w-107 shrink-0">
              <RankingPanel />
            </div>
          </div>
        </div>
      ) : (
        <Tabs
          className="relative mt-10 space-y-3"
          variant="tertiary"
          headerClassName="justify-center"
          tabs={tabs}
        />
      )}
    </Page>
  );
};

export default PrimeLeaderboard;
