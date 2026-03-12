import BigNumber from 'bignumber.js';
import { useGetTokenListUsdPrice } from 'clients/api/queries/getTokenUsdPrice/useGetTokenListUsdPrice';
import { CellGroup, type CellProps } from 'components';
import { routes } from 'constants/routing';
import { type ActiveModal, VaultModals } from 'containers/Vault';
import { VaultCardSimplified } from 'containers/Vault/VaultCard/Simplified';
import { useTranslation } from 'libs/translations';
import { useState } from 'react';
import type { Vault, Vault as VaultType } from 'types';
import { convertPriceMantissaToDollars, formatCentsToReadableValue } from 'utilities';
import { Placeholder } from '../Placeholder';

export interface VaultsProps {
  vaults: VaultType[];
}

export const Vaults: React.FC<VaultsProps> = ({ vaults }) => {
  const { t } = useTranslation();

  const [activeModal, setActiveModal] = useState<ActiveModal | undefined>(undefined);
  const [activeVault, setActiveVault] = useState<Vault | undefined>(undefined);

  const openModal = (_vault: Vault, _activeModal?: ActiveModal) => {
    setActiveVault(_vault);
    setActiveModal(_activeModal);
  };

  const closeModal = () => {
    setActiveVault(undefined);
    setActiveModal(undefined);
  };

  // Filter out vaults user has not staked in
  const filteredVaults = vaults.filter(vault => vault.userStakedMantissa?.isGreaterThan(0));

  const modalDom = activeVault ? (
    <VaultModals vault={activeVault} activeModal={activeModal} onClose={closeModal} />
  ) : null;

  const stakedTokenPriceResults = useGetTokenListUsdPrice({
    tokens: filteredVaults.map(vault => vault.stakedToken),
  });
  const rewardTokenPriceResults = useGetTokenListUsdPrice({
    tokens: filteredVaults.map(vault => vault.rewardToken),
  });

  if (filteredVaults.length === 0) {
    return (
      <>
        <Placeholder
          iconName="vault"
          title={t('account.vaults.placeholder.title')}
          to={routes.staking.path}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-6">
          {(vaults ?? []).slice(0, 3).map(vault => (
            <VaultCardSimplified
              key={`${vault.poolIndex}-${vault.stakedToken.address}-${vault.rewardToken.address}`}
              vault={vault}
              onClick={() => openModal(vault, 'stake')}
            />
          ))}
        </div>
        {modalDom}
      </>
    );
  }

  const { totalStakedUsd, dailyEarnUsd } = filteredVaults.reduce(
    (accu, curr, index) => {
      return {
        totalStakedUsd: convertPriceMantissaToDollars({
          priceMantissa: curr.userStakedMantissa
            ? curr.userStakedMantissa.times(
                stakedTokenPriceResults?.[index]?.data?.tokenPriceUsd ?? 0,
              )
            : new BigNumber(0),
          decimals: curr.stakedToken.decimals,
        }).plus(accu.totalStakedUsd),
        dailyEarnUsd: convertPriceMantissaToDollars({
          priceMantissa:
            curr.userStakedMantissa && curr.totalStakedMantissa.gt(0)
              ? curr.userStakedMantissa
                  .div(curr.totalStakedMantissa)
                  .times(curr.dailyEmissionMantissa)
                  .times(rewardTokenPriceResults?.[index]?.data?.tokenPriceUsd ?? 0)
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
      value: formatCentsToReadableValue({ value: totalStakedUsd.shiftedBy(2) }),
    },
    {
      label: t('dashboard.vaults.dailyEarnings'),
      value: formatCentsToReadableValue({ value: dailyEarnUsd.shiftedBy(2) }),
      tooltip: t('dashboard.vaults.dailyEarningsTooltip'),
    },
  ];

  return (
    <>
      <CellGroup variant="secondary" cells={overviewCells} className="mb-6" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {filteredVaults.map(vault => (
          <VaultCardSimplified
            key={`${vault.poolIndex}-${vault.stakedToken.address}-${vault.rewardToken.address}`}
            vault={vault}
            onClick={() => openModal(vault, 'withdraw')}
          />
        ))}
      </div>
      {modalDom}
    </>
  );
};
