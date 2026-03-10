import { routes } from 'constants/routing';
import { VaultCardSimplified } from 'containers/Vault/VaultCard/Simplified';
import { useTranslation } from 'libs/translations';
import type { Vault as VaultType } from 'types';
import { Placeholder } from '../Placeholder';

export interface VaultsProps {
  vaults: VaultType[];
}

export const Vaults: React.FC<VaultsProps> = ({ vaults }) => {
  const { t } = useTranslation();

  // Filter out vaults user has not staked in
  const filteredVaults = vaults.filter(vault => vault.userStakedMantissa?.isGreaterThan(0));

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
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
      {filteredVaults.map(vault => (
        <VaultCardSimplified
          key={`${vault.poolIndex}-${vault.stakedToken.address}-${vault.rewardToken.address}`}
          vault={vault}
        />
      ))}
    </div>
  );
};
