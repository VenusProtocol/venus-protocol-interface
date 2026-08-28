import { type Token, type Vault, VaultStatus } from 'types';
import { areTokensEqual } from 'utilities';

export const getVaultTier = ({ vault, xvs, vai }: { vault: Vault; xvs?: Token; vai?: Token }) => {
  const isXvsOrVaiVault =
    (xvs && areTokensEqual(vault.stakedToken, xvs)) ||
    (vai && areTokensEqual(vault.stakedToken, vai));

  let tier = 7; // Last tier

  // Determine tier based on vault status
  if (isXvsOrVaiVault) {
    tier = 6;
  } else if (vault.status === VaultStatus.Deposit) {
    tier = 1;
  } else if (vault.status === VaultStatus.Refund) {
    tier = 2;
  } else if (vault.status === VaultStatus.Locked || vault.status === VaultStatus.Repaying) {
    tier = 3;
  } else if (vault.status === VaultStatus.Claim) {
    tier = 4;
  } else if (vault.status === VaultStatus.Pending) {
    tier = 5;
  }

  return tier;
};
