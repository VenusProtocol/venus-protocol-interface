import BigNumber from 'bignumber.js';
import { useGetTokenListUsdPrice } from 'clients/api';
import { CellGroup, type CellProps } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { routes } from 'constants/routing';
import { Link } from 'containers/Link';
import { VaultCardSimplified } from 'containers/Vault/VaultCard/Simplified';
import { useTranslation } from 'libs/translations';
import type { Vault } from 'types';
import { convertPriceMantissaToDollars, formatCentsToReadableValue } from 'utilities';
import { Placeholder } from '../Placeholder';

export interface VaultsProps {
  vaults: Vault[];
}

export const Vaults: React.FC<VaultsProps> = ({ vaults }) => {
  const { t } = useTranslation();

  // Filter out vaults user has not staked in
  const filteredVaults = vaults.filter(vault => vault.userStakedMantissa?.isGreaterThan(0));

  const filteredVaultsLength = filteredVaults.length;

  const { data: tokenPricesData, isLoading } = useGetTokenListUsdPrice(
    {
      tokens: [
        ...filteredVaults.map(vault => vault.stakedToken),
        ...filteredVaults.map(vault => vault.rewardToken),
      ],
    },
    {
      enabled: filteredVaultsLength > 0,
    },
  );

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

  const stakedTokenPrices = tokenPricesData?.slice(0, filteredVaultsLength);
  const rewardTokenPrices = tokenPricesData?.slice(filteredVaultsLength);

  const { totalStakedUsd, dailyEarnUsd } = filteredVaults.reduce(
    (accu, curr, index) => {
      return {
        totalStakedUsd: convertPriceMantissaToDollars({
          priceMantissa: curr.userStakedMantissa
            ? curr.userStakedMantissa.times(stakedTokenPrices?.[index]?.tokenPriceUsd ?? 0)
            : new BigNumber(0),
          decimals: curr.stakedToken.decimals,
        }).plus(accu.totalStakedUsd),
        dailyEarnUsd: convertPriceMantissaToDollars({
          priceMantissa:
            curr.userStakedMantissa && curr.totalStakedMantissa.gt(0)
              ? curr.userStakedMantissa
                  .div(curr.totalStakedMantissa)
                  .times(curr.dailyEmissionMantissa)
                  .times(rewardTokenPrices?.[index]?.tokenPriceUsd ?? 0)
              : new BigNumber(0),
          decimals: curr.rewardToken.decimals,
        }).plus(accu.dailyEarnUsd),
      };
    },
    { totalStakedUsd: new BigNumber(0), dailyEarnUsd: new BigNumber(0) },
  );

  const overviewCells: CellProps[] = [
    {
      label: t('dashboard.vaults.totalStakedValue'),
      value: isLoading
        ? PLACEHOLDER_KEY
        : formatCentsToReadableValue({ value: totalStakedUsd.shiftedBy(2) }),
    },
    {
      label: t('dashboard.vaults.dailyEarnings'),
      value: isLoading
        ? PLACEHOLDER_KEY
        : formatCentsToReadableValue({ value: dailyEarnUsd.shiftedBy(2) }),
      tooltip: t('dashboard.vaults.dailyEarningsTooltip'),
    },
  ];

  return (
    <>
      <CellGroup variant="secondary" cells={overviewCells} className="mb-6" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {filteredVaults.map(vault => (
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
};
