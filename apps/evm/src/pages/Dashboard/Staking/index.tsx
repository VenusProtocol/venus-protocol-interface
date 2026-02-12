import { useGetVaults } from 'clients/api';
import { Spinner } from 'components';
import { routes } from 'constants/routing';
import { Vault } from 'containers/Vault';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { Placeholder } from '../Placeholder';

export const Staking: React.FC = () => {
  const { t } = useTranslation();

  const { accountAddress } = useAccountAddress();
  const { data: getVaultsData, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });
  const vaults = getVaultsData || [];

  // Filter out vaults user has not staked in
  const userVaults = vaults.filter(vault => vault.userStakedMantissa?.isGreaterThan(0));

  if (isGetVaultsLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(userVaults.length > 0 ? userVaults : vaults).map(vault => (
          <Vault
            key={`${vault.poolIndex}-${vault.stakedToken.address}-${vault.rewardToken.address}`}
            vault={vault}
            variant={userVaults.length > 0 ? 'secondary' : 'tertiary'}
          />
        ))}
      </div>

      {userVaults.length === 0 && (
        <Placeholder
          iconName="vault"
          title={t('dashboard.staking.placeholder.title')}
          to={routes.staking.path}
        />
      )}
    </div>
  );
};
