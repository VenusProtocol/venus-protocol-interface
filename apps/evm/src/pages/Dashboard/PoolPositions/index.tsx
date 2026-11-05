import { useGetSpokePools } from 'clients/api';
import { Spinner } from 'components';
import { routes } from 'constants/routing';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { useState } from 'react';
import type { LiquidityHub, Pool, Vault } from 'types';
import { Hubs } from '../Hubs';
import { IsolatedPoolsDeprecationNotice } from '../Markets/IsolatedPoolsDeprecationNotice';
import { PoolPills } from '../Markets/PoolPills';
import { Positions } from '../Markets/Positions';
import { SpokePositions } from '../Markets/SpokePositions';
import { Placeholder } from '../Placeholder';
import { Vaults } from '../Vaults';

const CORE_CHOICE_ID = 'core';
const HUB_CHOICE_ID = 'hub';
const VAULTS_CHOICE_ID = 'vaults';

export interface PoolPositionsProps {
  pool?: Pool;
  liquidityHubs: LiquidityHub[];
  vaults: Vault[];
  isPoolLoading: boolean;
  isHubsLoading: boolean;
  isVaultsLoading: boolean;
}

export const PoolPositions: React.FC<PoolPositionsProps> = ({
  pool,
  liquidityHubs,
  vaults,
  isPoolLoading,
  isHubsLoading,
  isVaultsLoading,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const isSpokeEnabled = useIsFeatureEnabled({ name: 'spoke' });
  const isLiquidityHubEnabled = useIsFeatureEnabled({ name: 'liquidityHub' });
  const [selectedId, setSelectedId] = useState<string>();

  const {
    data: getSpokePoolsData,
    isLoading: isGetSpokePoolsLoading,
    errorUpdateCount: getSpokePoolsErrorCount,
  } = useGetSpokePools({ accountAddress }, { enabled: !!accountAddress });

  const isLoading = isPoolLoading || (isGetSpokePoolsLoading && getSpokePoolsErrorCount === 0);

  const spokePoolsWithPositions =
    isSpokeEnabled && accountAddress
      ? (getSpokePoolsData?.spokePools ?? []).filter(spokePool =>
          spokePool.assets.some(
            asset =>
              asset.userSupplyBalanceTokens.isGreaterThan(0) ||
              asset.userBorrowBalanceTokens.isGreaterThan(0),
          ),
        )
      : [];

  const hasCorePositions =
    !!accountAddress &&
    !!pool?.assets.some(
      asset =>
        asset.userSupplyBalanceTokens.isGreaterThan(0) ||
        asset.userBorrowBalanceTokens.isGreaterThan(0) ||
        asset.isCollateralOfUser,
    );

  const placeholder = (
    <Placeholder
      title={t('account.pools.placeholder.title')}
      buttonLabel={t('account.pools.placeholder.buttonLabel')}
      to={routes.landing.path}
    />
  );

  const hubsWithPositions = liquidityHubs.filter(liquidityHub =>
    liquidityHub.userSupplyBalanceTokens?.isGreaterThan(0),
  );
  const vaultsWithPositions = vaults.filter(vault =>
    vault.userStakeBalanceMantissa?.isGreaterThan(0),
  );

  const choices = [];

  if (isLiquidityHubEnabled && (isHubsLoading || hubsWithPositions.length > 0)) {
    choices.push({
      id: HUB_CHOICE_ID,
      name: t('account.tabs.hubs'),
      healthFactor: undefined,
      content: isHubsLoading ? <Spinner /> : <Hubs liquidityHubs={hubsWithPositions} />,
    });
  }

  if (hasCorePositions && pool) {
    choices.push({
      id: CORE_CHOICE_ID,
      name: t('account.spoke.corePoolPill'),
      healthFactor: pool.userBorrowBalanceCents?.isGreaterThan(0)
        ? pool.userHealthFactor
        : undefined,
      content: <Positions pools={[pool]} />,
    });
  }

  spokePoolsWithPositions.forEach(spokePool =>
    choices.push({
      id: spokePool.comptrollerAddress,
      name: spokePool.name,
      healthFactor: spokePool.userBorrowBalanceCents?.isGreaterThan(0)
        ? spokePool.userHealthFactor
        : undefined,
      content: <SpokePositions spokePool={spokePool} />,
    }),
  );

  if (isVaultsLoading || vaultsWithPositions.length > 0) {
    choices.push({
      id: VAULTS_CHOICE_ID,
      name: t('account.tabs.vaults'),
      healthFactor: undefined,
      content: isVaultsLoading ? <Spinner /> : <Vaults vaults={vaultsWithPositions} />,
    });
  }

  const active = choices.find(choice => choice.id === selectedId) ?? choices[0];

  return (
    <section aria-label={t('account.positions.label')} className="flex flex-col gap-6">
      <IsolatedPoolsDeprecationNotice />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <h2 className="text-p1s max-sm:sr-only lg:shrink-0">{t('account.positions.label')}</h2>

        {!isLoading && active && (
          <PoolPills
            pools={choices.map(({ id, name, healthFactor }) => ({ id, name, healthFactor }))}
            selectedPoolId={active.id}
            onChange={setSelectedId}
          />
        )}
      </div>

      {isLoading ? <Spinner /> : active?.content ?? placeholder}
    </section>
  );
};
