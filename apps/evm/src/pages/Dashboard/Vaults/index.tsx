import BigNumber from 'bignumber.js';
import { CellGroup, type CellProps } from 'components';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { VaultSimpleCard } from 'containers/Vault/VaultSimpleCard';
import { useTranslation } from 'libs/translations';
import { type Vault, VaultManager } from 'types';
import { formatCentsToReadableValue } from 'utilities';
import { Placeholder } from '../Placeholder';

export interface VaultsProps {
  vaults: Vault[];
}

export const Vaults: React.FC<VaultsProps> = ({ vaults }) => {
  const { t } = useTranslation();

  // Filter out vaults user has not staked in
  const filteredVaults = vaults.filter(vault => vault.userStakedMantissa?.isGreaterThan(0));

  const filteredVaultsLength = filteredVaults.length;

  if (filteredVaultsLength === 0) {
    return (
      <>
        <Placeholder
          iconName="vault"
          title={t('account.vaults.placeholder.title')}
          to={routes.vaults.path}
          buttonSize="sm"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
          {(vaults ?? []).slice(0, 3).map(vault => (
            <Link
              to={routes.vaults.path}
              key={`${vault.poolIndex}-${vault.stakedToken.address}-${vault.rewardToken.address}`}
              noStyle
            >
              <VaultSimpleCard vault={vault} />
            </Link>
          ))}
        </div>
      </>
    );
  }

  const { totalStakedCents, dailyEarningsCents } = filteredVaults.reduce(
    (acc, curr) => {
      const userDailyEarningsCents =
        curr.userStakedMantissa && curr.totalStakedMantissa.gt(0) && 'dailyEmissionCents' in curr
          ? curr.userStakedMantissa.div(curr.totalStakedMantissa).times(curr.dailyEmissionCents)
          : new BigNumber(0);

      return {
        totalStakedCents: acc.totalStakedCents.plus(curr.userStakedCents ?? 0),
        dailyEarningsCents: acc.dailyEarningsCents.plus(userDailyEarningsCents),
      };
    },
    { totalStakedCents: new BigNumber(0), dailyEarningsCents: new BigNumber(0) },
  );

  const overviewCells: CellProps[] = [
    {
      label: t('dashboard.vaults.totalStakedValue'),
      value: formatCentsToReadableValue({ value: totalStakedCents }),
    },
    {
      label: t('dashboard.vaults.dailyEarnings'),
      value: formatCentsToReadableValue({ value: dailyEarningsCents }),
      tooltip: t('dashboard.vaults.dailyEarningsTooltip'),
    },
  ];

  return (
    <>
      <CellGroup variant="secondary" cells={overviewCells} className="mb-6" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {filteredVaults.map(vault =>
          vault.manager === VaultManager.Venus ? (
            <Link
              to={routes.vaults.path}
              key={`${vault.poolIndex}-${vault.stakedToken.address}-${vault.rewardToken.address}`}
              noStyle
              onClick={e => e.stopPropagation()}
            >
              <VaultSimpleCard vault={vault} />
            </Link>
          ) : (
            <VaultSimpleCard vault={vault} key={vault.key} />
          ),
        )}
      </div>
    </>
  );
};
