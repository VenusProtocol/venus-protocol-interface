import type {
  GetFixedRatedVaultUserStakedTokensOutput,
  GetFixedRatedVaultsOutput,
} from 'clients/api';
import type { Pool, Vault } from 'types';
import { formatToInstitutionalVault } from './formatToInstitutionalVault';
import { formatToPendleVault } from './formatToPendleVault';
import type { BaseInput } from './types';

interface FormatToVaultsInput extends BaseInput {
  vaultProducts: GetFixedRatedVaultsOutput;
  userStakedAmounts?: GetFixedRatedVaultUserStakedTokensOutput;
  pools: Pool[];
}

export const formatVaults = ({
  vaultProducts,
  pools,
  tokens,
  nowMs,
  userStakedAmounts,
}: FormatToVaultsInput): Vault[] => {
  const userStakedAmountsByVaultAddress = new Map(
    userStakedAmounts?.map(entry => [entry.vaultAddress, entry]),
  );

  return vaultProducts.reduce<Vault[]>((acc, vaultData) => {
    let vault: Vault | undefined = undefined;
    if (vaultData.protocol === 'pendle') {
      vault = formatToPendleVault({ vaultData, pools, tokens, nowMs });
    } else if (vaultData.protocol === 'institutional-vault') {
      vault = formatToInstitutionalVault({
        vaultData,
        tokens,
        userStakedAmount: userStakedAmountsByVaultAddress.get(vaultData.vaultAddress),
        nowMs,
      });
    }

    if (vault) {
      acc.push(vault);
    }

    return acc;
  }, []);
};
