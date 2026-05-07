import BigNumber from 'bignumber.js';
import { CellGroup, type CellProps } from 'components';
import { routes } from 'constants/routing';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import { Link } from 'containers/Link';
import { VaultCardSimplified } from 'containers/VaultCard/Simplified';
import { useTranslation } from 'libs/translations';
import type { Vault } from 'types';
import { formatCentsToReadableValue } from 'utilities';
import { Placeholder } from '../Placeholder';

export interface VaultsProps {
  vaults: Vault[];
}

export const Vaults: React.FC<VaultsProps> = ({ vaults }) => {
  const { t } = useTranslation();

  // Filter out vaults user has not staked in
  const filteredVaults = vaults.filter(vault => vault.userStakeBalanceMantissa?.isGreaterThan(0));

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
              <VaultCardSimplified vault={vault} />
            </Link>
          ))}
        </div>
      </>
    );
  }

  const { stakeBalanceCents, dailyEarningsCents } = filteredVaults.reduce(
    (acc, curr) => {
      const userDailyEarningsCents =
        curr.userStakeBalanceMantissa &&
        curr.stakeBalanceMantissa.gt(0) &&
        'dailyEmissionCents' in curr
          ? curr.userStakeBalanceMantissa
              .div(curr.stakeBalanceMantissa)
              .times(curr.dailyEmissionCents)
          : new BigNumber(0);

      return {
        stakeBalanceCents: acc.stakeBalanceCents.plus(curr.userStakeBalanceCents ?? 0),
        dailyEarningsCents: acc.dailyEarningsCents.plus(userDailyEarningsCents),
      };
    },
    { stakeBalanceCents: new BigNumber(0), dailyEarningsCents: new BigNumber(0) },
  );

  const overviewCells: CellProps[] = [
    {
      label: t('dashboard.vaults.totalStakedValue'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: stakeBalanceCents })}
        </HidableUserBalance>
      ),
    },
    {
      label: t('dashboard.vaults.dailyEarnings'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: dailyEarningsCents })}
        </HidableUserBalance>
      ),
      tooltip: t('dashboard.vaults.dailyEarningsTooltip'),
    },
  ];

  return (
    <>
      <CellGroup variant="secondary" cells={overviewCells} className="mb-6" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {filteredVaults.map(vault => (
          <VaultCardSimplified vault={vault} key={vault.key} />
        ))}
      </div>
    </>
  );
};
