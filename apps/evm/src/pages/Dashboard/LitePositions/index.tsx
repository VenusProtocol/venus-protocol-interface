import { useGetSpokePools } from 'clients/api';
import { Spinner } from 'components';
import { useGetMarketsPagePath } from 'hooks/useGetMarketsPagePath';
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

export interface LitePositionsProps {
  pool?: Pool;
  liquidityHubs: LiquidityHub[];
  vaults: Vault[];
  isHubsLoading: boolean;
  isVaultsLoading: boolean;
}

export const LitePositions: React.FC<LitePositionsProps> = ({
  pool,
  liquidityHubs,
  vaults,
  isHubsLoading,
  isVaultsLoading,
}) => {
  const { t } = useTranslation();
  const { accountAddress } = useAccountAddress();
  const { marketsPagePath } = useGetMarketsPagePath();
  const isSpokeEnabled = useIsFeatureEnabled({ name: 'spoke' });
  const isLiquidityHubEnabled = useIsFeatureEnabled({ name: 'liquidityHub' });
  const [selectedId, setSelectedId] = useState<string>();

  const { data: getSpokePoolsData } = useGetSpokePools(
    { accountAddress },
    { enabled: !!accountAddress },
  );

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
      iconName="venus"
      title={t('account.pools.placeholder.title')}
      to={marketsPagePath}
      buttonSize="sm"
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

  if (choices.length === 0) {
    choices.push({
      id: CORE_CHOICE_ID,
      name: t('account.spoke.corePoolPill'),
      healthFactor: undefined,
      content: placeholder,
    });
  }

  const active = choices.find(choice => choice.id === selectedId) ?? choices[0];

  return (
    <section aria-label={t('account.positions.label')} className="flex flex-col gap-6">
      <IsolatedPoolsDeprecationNotice />

      <h2 className="text-p1s">{t('account.positions.label')}</h2>

      <PoolPills
        pools={choices.map(({ id, name, healthFactor }) => ({ id, name, healthFactor }))}
        selectedPoolId={active.id}
        onChange={setSelectedId}
      />

      {active.content}
    </section>
  );
};
