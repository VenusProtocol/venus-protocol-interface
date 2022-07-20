/** @jsxImportSource @emotion/react */
import { Spinner } from 'components';
import React, { useContext } from 'react';
import { Vault } from 'types';

import { useGetVaults } from 'clients/api';
import { AuthContext } from 'context/AuthContext';

import VaultItem from './VaultItem';
import { useStyles } from './styles';

export interface VaultUiProps {
  vaults: Vault[];
  isInitialLoading: boolean;
}

const generateVaultKey = (vault: Vault) =>
  `vault-${vault.stakedTokenId}-${vault.rewardTokenId}-${vault.lockingPeriodMs || 0}`;

export const VaultUi: React.FC<VaultUiProps> = ({ vaults, isInitialLoading }) => {
  const styles = useStyles();

  if (isInitialLoading || vaults.length === 0) {
    return <Spinner />;
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
