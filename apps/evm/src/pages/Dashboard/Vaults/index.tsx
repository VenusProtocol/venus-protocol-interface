import { routes } from 'constants/routing';
import { Vault } from 'containers/Vault';
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
      <Placeholder
        iconName="vault"
        title={t('account.vaults.placeholder.title')}
        description={t('account.vaults.placeholder.description')}
        to={routes.staking.path}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {filteredVaults.map(vault => (
        <Vault
          key={`${vault.poolIndex}-${vault.stakedToken.address}-${vault.rewardToken.address}`}
          vault={vault}
          variant="secondary"
        />
      ))}
    </div>
  );
};
