import type { Vault } from 'types';
import { isInstitutionalVault } from 'utilities';

export const userHasFunds = (vault: Vault) =>
  !!vault.userStakeBalanceMantissa?.gt(0) ||
  (isInstitutionalVault(vault) &&
    (vault.userRedeemLimitMantissa.gt(0) || vault.userWithdrawLimitMantissa.gt(0)));
