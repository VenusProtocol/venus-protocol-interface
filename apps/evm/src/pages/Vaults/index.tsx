/** @jsxImportSource @emotion/react */
import { useGetVaults } from 'clients/api';
import { Page, Spinner } from 'components';
import { useAccountAddress } from 'libs/wallet';
import type { Vault as VaultType } from 'types';

import { Vault } from 'containers/Vault';
import { useStyles } from './styles';

export interface VaultsUiProps {
  vaults: VaultType[];
  isInitialLoading: boolean;
}

const generateVaultKey = (vault: VaultType) =>
  `vault-${vault.stakedToken.address}-${vault.rewardToken.address}-${vault.lockingPeriodMs || 0}`;

export const VaultUi: React.FC<VaultsUiProps> = ({ vaults, isInitialLoading }) => {
  const styles = useStyles();

  if (isInitialLoading || vaults.length === 0) {
    return <Spinner />;
  }

  return (
    <div css={styles.container}>
      {vaults.map(vault => (
        <Vault vault={vault} key={generateVaultKey(vault)} />
      ))}
    </div>
  );
};

const VaultsPage: React.FC = () => {
  const { accountAddress } = useAccountAddress();
  const { data: vaults, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress,
  });

  return (
    <Page indexWithSearchEngines={false}>
      <VaultUi vaults={vaults} isInitialLoading={isGetVaultsLoading} />
    </Page>
  );
};

export default VaultsPage;
