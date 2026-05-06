import type {
  GetFixedRatedVaultUserStakedTokensOutput,
  GetFixedRatedVaultsOutput,
  GetInstitutionalVaultUserMetricsOutput,
} from 'clients/api';
import type { Pool, Token, Vault } from 'types';
import { formatToCeffuVault } from './formatToCeffuVault';
import { formatToPendleVault } from './formatToPendleVault';

interface FormatToPendleVaultsInput {
  pools: Pool[];
  tokens: Token[];
  nowMs: number;
  vaultProducts: GetFixedRatedVaultsOutput;
  userStakedAmounts?: GetFixedRatedVaultUserStakedTokensOutput;
  userMetrics?: GetInstitutionalVaultUserMetricsOutput;
}

export const formatVaults = ({
  vaultProducts,
  pools,
  tokens,
  nowMs,
  userStakedAmounts,
  userMetrics,
}: FormatToPendleVaultsInput): Vault[] => {
  const userStakedAmountsByVaultAddress = new Map(
    userStakedAmounts?.map(userStakedAmount => [userStakedAmount.vaultAddress, userStakedAmount]),
  );
  const userMetricsByVaultAddress = new Map(
    userMetrics?.map(userMetric => [userMetric.vaultAddress, userMetric]),
  );

  return vaultProducts.reduce<Vault[]>((acc, vaultData) => {
    let vault: Vault | undefined = undefined;

    if (vaultData.protocol === 'pendle') {
      vault = formatToPendleVault({ vaultData, pools, tokens, nowMs });
    } else if (vaultData.protocol === 'institutional-vault') {
      vault = formatToCeffuVault({
        vaultData,
        tokens,
        nowMs,
        userStakedAmount: userStakedAmountsByVaultAddress.get(vaultData.vaultAddress),
        userMetric: userMetricsByVaultAddress.get(vaultData.vaultAddress),
      });
    }

    if (vault) {
      acc.push(vault);
    }

    return acc;
  }, []);
};
