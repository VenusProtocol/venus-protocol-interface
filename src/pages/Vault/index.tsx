/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';

import LoadingSpinner from 'components/Basic/LoadingSpinner';
import { AuthContext } from 'context/AuthContext';
import { useGetVaults } from 'clients/api';
import { Vault } from 'types';
import VaultItem from './VaultItem';
import { useStyles } from './styles';

export interface IVaultUi {
  vaults: Vault[];
  isInitialLoading: boolean;
}

const generateVaultKey = (vault: Vault) =>
  `vault-${vault.stakedTokenId}-${vault.rewardTokenId}-${vault.lockingPeriodMs || 0}`;

export const VaultUi: React.FC<IVaultUi> = ({ vaults, isInitialLoading }) => {
  const styles = useStyles();

  if (isInitialLoading || vaults.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div css={styles.container}>
      {vaults.map(vault => (
        <VaultItem {...vault} key={generateVaultKey(vault)} />
      ))}
    </div>
  );
};

const VaultPage: React.FC = () => {
  const { account } = useContext(AuthContext);
  const { data: vaults, isLoading: isGetVaultsLoading } = useGetVaults({
    accountAddress: account?.address,
  });

  return <VaultUi vaults={vaults} isInitialLoading={isGetVaultsLoading} />;
};

export default VaultPage;
