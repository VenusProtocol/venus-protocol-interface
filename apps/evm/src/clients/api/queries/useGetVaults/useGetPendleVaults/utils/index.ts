import type { GetFixedRatedVaultsOutput } from 'clients/api';
import type { PendleVault } from 'types';
import { type BaseInput, formatVaultProduct } from './formatVaultProduct';

interface FormatToPendleVaultsInput extends BaseInput {
  vaultProducts: GetFixedRatedVaultsOutput;
}

export const formatToPendleVaults = ({
  vaultProducts,
  pools,
  tokens,
  now,
}: FormatToPendleVaultsInput): PendleVault[] =>
  vaultProducts.reduce<PendleVault[]>((acc, vaultData) => {
    const vault = formatVaultProduct({ vaultData, pools, tokens, now });
    if (vault) {
      acc.push(vault);
    }
    return acc;
  }, []);
