import type { GetFixedRatedVaultsOutput } from 'clients/api';
import type { Vault } from 'types';
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
    }
    if (vault) {
      acc.push(vault);
    }
    return acc;
  }, []);
