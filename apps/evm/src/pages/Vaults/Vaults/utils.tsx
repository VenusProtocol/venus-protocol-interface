import { Icon } from 'components/Icon';
import type { ReactNode } from 'react';
import type { Vault } from 'types';

export const generateVaultKey = (vault: Vault) =>
  `vault-${vault.stakedToken.address}-${vault.rewardToken.address}-${vault.lockingPeriodMs || 0}`;

export const getVaultMetadata = (vault: Vault) => {
  let category: string | undefined;
  let curator: string | undefined;
  let status: string | undefined;
  let curatorLogo: ReactNode;

  if (vault.stakedToken.symbol === 'XVS') {
    category = 'others';
    curator = 'venus';
    curatorLogo = <Icon name="logoMobile" />;
    status = vault.isPaused ? '' : 'active';
  } else if (vault.stakedToken.symbol === 'VAI') {
    category = 'stablecoins';
    curator = 'venus';
    curatorLogo = <Icon name="logoMobile" />;
    status = vault.isPaused ? '' : 'active';
  }

  return {
    category,
    curator,
    status,
    curatorLogo,
  };
};
