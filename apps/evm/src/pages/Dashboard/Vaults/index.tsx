import BigNumber from 'bignumber.js';
import type { CellProps } from 'components';
import { routes } from 'constants/routing';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import { useSortVaults } from 'hooks/useSortVaults';
import { useTranslation } from 'libs/translations';
import type { Vault } from 'types';
import { formatCentsToReadableValue } from 'utilities';
import { PositionCardsTab } from '../PositionCardsTab';
import { VaultCard } from './VaultCard';

export interface VaultsProps {
  vaults: Vault[];
}

export const Vaults: React.FC<VaultsProps> = ({ vaults }) => {
  const { t } = useTranslation();

  const sortedVaults = useSortVaults({ vaults });

  const { stakeBalanceCents, dailyEarningsCents } = vaults.reduce(
    (acc, curr) => {
      const userStakeBalanceMantissa = curr.userStakeBalanceMantissa;

      if (userStakeBalanceMantissa?.isGreaterThan(0) !== true) {
        return acc;
      }

      let userDailyEarningsCents = new BigNumber(0);

      if (curr.stakeBalanceMantissa.gt(0) && 'dailyEmissionCents' in curr) {
        userDailyEarningsCents = userStakeBalanceMantissa
          .div(curr.stakeBalanceMantissa)
          .times(curr.dailyEmissionCents);
      }

      return {
        stakeBalanceCents: acc.stakeBalanceCents.plus(curr.userStakeBalanceCents ?? 0),
        dailyEarningsCents: acc.dailyEarningsCents.plus(userDailyEarningsCents),
      };
    },
    { stakeBalanceCents: new BigNumber(0), dailyEarningsCents: new BigNumber(0) },
  );

  const summaryCells: CellProps[] = [
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
    <PositionCardsTab
      items={sortedVaults}
      activePositionFilter={vault => vault.userStakeBalanceMantissa?.isGreaterThan(0) === true}
      summaryCells={summaryCells}
      placeholderIconName="vault"
      placeholderTitle={t('account.vaults.placeholder.title')}
      placeholderRoute={routes.vaults.path}
      renderCard={(vault, isPreview) => (
        <VaultCard vault={vault} to={isPreview ? routes.vaults.path : undefined} />
      )}
      getKey={vault => vault.key}
    />
  );
};
