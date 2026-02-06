import { useState } from 'react';

import { useGetPool, useGetVaults } from 'clients/api';
import { Carousel, CarouselItem, Icon } from 'components';
import { routes } from 'constants/routing';
import { useBreakpointUp } from 'hooks/responsive';
import { useChain } from 'hooks/useChain';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { StepCard, type StepCardProps } from './StepCard';

export const Guide: React.FC = () => {
  const { t } = useTranslation();
  const { marketsPagePath } = useGetMarketsPagePath();
  const isSmUp = useBreakpointUp('sm');

  const { corePoolComptrollerContractAddress } = useChain();
  const { accountAddress } = useAccountAddress();

  const { data: getPoolData, isLoading: isGetPoolLoading } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const pool = getPoolData?.pool;

  const { data: getVaultsData, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });
  const vaults = getVaultsData || [];

  const isUserStakingInXvsVault = vaults.some(
    vault => vault.stakedToken.symbol === 'XVS' && vault.userStakedMantissa?.isGreaterThan(0),
  );
  const isUserSupplying = pool?.userSupplyBalanceCents?.isGreaterThan(0) || false;
  const isUserBorrowing = pool?.userBorrowBalanceCents?.isGreaterThan(0) || false;

  const [areItemsCollapsed, setAreItemsCollapsed] = useState(false);
  const toggleCollapseItems = () => setAreItemsCollapsed(current => !current);

  const steps: Omit<StepCardProps, 'isCollapsed'>[] = [
    {
      title: t('dashboard.guide.step1.title'),
      description: t('dashboard.guide.step1.description'),
      isCompleted: isUserSupplying,
      to: marketsPagePath,
    },
    {
      title: t('dashboard.guide.step2.title'),
      description: t('dashboard.guide.step2.description'),
      isCompleted: isUserBorrowing,
      to: marketsPagePath,
    },
    {
      title: t('dashboard.guide.step3.title'),
      description: t('dashboard.guide.step3.description'),
      isCompleted: isUserStakingInXvsVault,
      to: routes.staking.path,
    },
  ];

  const isLoading = isGetPoolLoading || isGetVaultsLoading;

  // Render nothing if user has already completed all the steps
  if (isLoading || !steps.some(step => !step.isCompleted)) {
    return undefined;
  }

  return (
    <>
      {isSmUp ? (
        // Tablet/desktop UI
        <div className="hidden gap-x-3 items-start sm:flex">
          <div className="flex gap-x-3 grow">
            {steps.map(step => (
              <StepCard {...step} isCollapsed={areItemsCollapsed} />
            ))}
          </div>

          <button type="button" className="cursor-pointer shrink-0" onClick={toggleCollapseItems}>
            <Icon name={areItemsCollapsed ? 'outerArrows' : 'innerArrows'} />
          </button>
        </div>
      ) : (
        // Mobile UI
        <Carousel
          autoPlay
          className="px-4 -mx-4 sm:hidden"
          trackerClassName="absolute bottom-4.5 right-7"
        >
          {steps.map(step => (
            <CarouselItem key={step.title}>
              <StepCard {...step} isCollapsed={areItemsCollapsed} />
            </CarouselItem>
          ))}
        </Carousel>
      )}
    </>
  );
};
