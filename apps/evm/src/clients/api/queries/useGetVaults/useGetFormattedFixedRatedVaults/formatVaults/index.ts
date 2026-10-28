import type { GetFixedRatedVaultsOutput, GetInstitutionalVaultUserDataOutput } from 'clients/api';
import type { Pool, Token, Vault } from 'types';
import { formatToInstitutionalVault } from './formatToInstitutionalVault';
import { formatToPendleVault } from './formatToPendleVault';

interface FormatToPendleVaultsInput {
  pools: Pool[];
  tokens: Token[];
  nowMs: number;
  vaultProducts: GetFixedRatedVaultsOutput;
  institutionalVaultUserData?: GetInstitutionalVaultUserDataOutput;
  isUserDataUnavailable?: boolean;
}

export const formatVaults = ({
  vaultProducts,
  pools,
  tokens,
  nowMs,
  institutionalVaultUserData,
  isUserDataUnavailable,
}: FormatToPendleVaultsInput): Vault[] => {
  const institutionalVaultUserDataByVaultAddress = new Map(
    institutionalVaultUserData?.map(userData => [userData.vaultAddress, userData]),
  );

  return vaultProducts.reduce<Vault[]>((acc, vaultData) => {
    let vault: Vault | undefined = undefined;

    if (vaultData.protocol === 'pendle') {
      vault = formatToPendleVault({ vaultData, pools, tokens, nowMs });
    } else if (vaultData.protocol === 'institutional-vault') {
      vault = formatToInstitutionalVault({
        vaultData,
        tokens,
        nowMs,
        userData: institutionalVaultUserDataByVaultAddress.get(vaultData.vaultAddress),
        isUserDataUnavailable,
      });
    }

    if (vault) {
      acc.push(vault);
    }

    return acc;
  }, []);
};
