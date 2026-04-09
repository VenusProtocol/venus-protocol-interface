import type { GetFixedRatedVaultsOutput } from 'clients/api';
import type { Vault } from 'types';
import { formatToInstitutionalVault } from './formatToInstitutionalVault';
import { type BaseInput, formatToPendleVault } from './formatToPendleVault';

interface FormatToPendleVaultsInput extends BaseInput {
  vaultProducts: GetFixedRatedVaultsOutput;
}

export const formatVaults = ({
  vaultProducts,
  pools,
  tokens,
  nowMs,
}: FormatToPendleVaultsInput): Vault[] =>
  vaultProducts.reduce<Vault[]>((acc, vaultData) => {
    let vault: Vault | undefined = undefined;
    if (vaultData.protocol === 'pendle') {
      vault = formatToPendleVault({ vaultData, pools, tokens, nowMs });
    } else if (vaultData.protocol === 'institutional-vault') {
      vault = formatToInstitutionalVault({ vaultData, pools, tokens });
    }

    if (vault) {
      acc.push(vault);
    }

    return acc;
  }, []);
