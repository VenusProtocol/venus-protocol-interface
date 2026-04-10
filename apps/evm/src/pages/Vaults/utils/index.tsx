import { Icon } from 'components';
import type { ReactNode } from 'react';
import type { Vault } from 'types';

export const generateVaultKey = (vault: Vault) =>
  `vault-${vault.stakedToken.address}-${vault.rewardToken.address}-${vault.lockingPeriodMs || 0}`;

export const getVaultMetadata = (vault: Vault) => {
  let category = '';
  let curator = '';
  let status = '';
  let curatorLogo: ReactNode = null;

  if (vault.stakedToken.symbol === 'XVS') {
    category = 'others';
    curator = 'venus';
    curatorLogo = <Icon name="logoMobile" />;
    status =
      vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade ? 'paused' : 'active';
  } else if (vault.stakedToken.symbol === 'VAI') {
    category = 'stablecoins';
    curator = 'venus';
    curatorLogo = <Icon name="logoMobile" />;
    status =
      vault.isPaused || vault.userHasPendingWithdrawalsFromBeforeUpgrade ? 'paused' : 'active';
  }

  return {
    category,
    curator,
    status,
    curatorLogo,
  };
};
