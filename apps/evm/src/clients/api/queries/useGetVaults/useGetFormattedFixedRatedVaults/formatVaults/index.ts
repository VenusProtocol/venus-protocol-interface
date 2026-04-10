import type {
  GetFixedRatedVaultUserStakedTokensOutput,
  GetFixedRatedVaultsOutput,
} from 'clients/api';
import type { Vault } from 'types';
import { formatToInstitutionalVault } from './formatToInstitutionalVault';
import { type BaseInput, formatToPendleVault } from './formatToPendleVault';

interface FormatToPendleVaultsInput extends BaseInput {
  vaultProducts: GetFixedRatedVaultsOutput;
  userStakedAmounts?: GetFixedRatedVaultUserStakedTokensOutput;
}

export const formatVaults = ({
  vaultProducts,
  pools,
  tokens,
  nowMs,
  userStakedAmounts,
}: FormatToPendleVaultsInput): Vault[] =>
  vaultProducts.reduce<Vault[]>((acc, vaultData, index) => {
    let vault: Vault | undefined = undefined;
    if (vaultData.protocol === 'pendle') {
      vault = formatToPendleVault({ vaultData, pools, tokens, nowMs });
    } else if (
      vaultData.protocol === 'institutional-vault' &&
      Array.isArray(userStakedAmounts) &&
      userStakedAmounts[index]
    ) {
      vault = formatToInstitutionalVault({
        vaultData,
        tokens,
        userStakedAmount: userStakedAmounts[index],
        nowMs,
      });
    }

    if (vault) {
      acc.push(vault);
    }

    return acc;
  }, []);
