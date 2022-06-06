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
}

export const VaultUi: React.FC<IVaultUi> = ({ vaults }) => {
  const styles = useStyles();

  if (vaults.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div css={styles.container}>
      {vaults.map(vault => (
        <VaultItem
          {...vault}
          key={`vault-${vault.stakedTokenId}-${vault.rewardTokenId}`}
          // TODO: add callbacks (see https://app.clickup.com/t/2dfqc8g,
          // https://app.clickup.com/t/2dfqca0,
          // https://app.clickup.com/t/2dfqcb3)
          onClaim={() => {}}
          onReward={() => {}}
          onStake={() => {}}
        />
      ))}
    </div>
  );
};

const VaultPage: React.FC = () => {
  const { account } = useContext(AuthContext);
  const { data: vaults } = useGetVaults({
    accountAddress: account?.address,
  });

  return <VaultUi vaults={vaults} />;
};

export default VaultPage;
