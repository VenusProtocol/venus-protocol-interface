import BigNumber from 'bignumber.js';
import type { PendleVault, Pool, Token } from 'types';
import { VaultCategory, VaultManager, VaultStatus } from 'types';
import { areAddressesEqual, convertTokensToMantissa, findTokenByAddress } from 'utilities';
import type { GetVaultProductsOutput } from '../../getVaultProducts/types';

interface BaseInput {
  pools: Pool[];
  tokens: Token[];
  now: number;
}

interface FormatToPendleVaultsInput extends BaseInput {
  vaultProducts: GetVaultProductsOutput;
}

const formatVaultProduct = ({
  vaultData,
  pools,
  tokens,
  now,
}: BaseInput & { vaultData: GetVaultProductsOutput[number] }) => {
  const asset = pools
    .flatMap(pool => pool.assets)
    .find(asset => areAddressesEqual(asset.vToken.address, vaultData.vTokenAddress));

  const stakedToken = findTokenByAddress({
    address: vaultData.underlyingAssetAddress,
    tokens,
  });

  const rewardToken = findTokenByAddress({
    address: vaultData.protocolData?.accountingAsset?.address ?? '',
    tokens,
  });

  if (!stakedToken || !rewardToken || !asset) {
    return undefined;
  }

  const maturityDate = new Date(vaultData.maturityDate).getTime();

  let status = VaultStatus.Deposit;
  if (now >= maturityDate) {
    status = VaultStatus.Claim;
  } else if (now < maturityDate && asset.userSupplyBalanceCents.gt(0)) {
    status = VaultStatus.Earning;
  }

  return {
    key: vaultData.id,
    stakedToken,
    rewardToken,
    stakingAprPercentage: new BigNumber(vaultData.fixedApyDecimal).shiftedBy(2).toNumber(),
    userStakedMantissa: convertTokensToMantissa({
      value: asset.userSupplyBalanceTokens,
      token: stakedToken,
    }),
    totalStakedMantissa: convertTokensToMantissa({
      value: asset.supplyBalanceTokens,
      token: stakedToken,
    }),
    stakedTokenPriceUsd: new BigNumber(vaultData.protocolData.ptTokenPriceUsd),
    rewardTokenPriceUsd: new BigNumber(vaultData.protocolData?.accountingAsset?.priceUsd),
    maturityDate,
    liquidityCents: new BigNumber(vaultData.protocolData.liquidityCents),
    category: VaultCategory.YieldTokens,
    manager: VaultManager.Pendle,
    managerIcon: 'pendle' as const,
    managerAddress: vaultData.protocolData.pendleMarketAddress,
    status,
    vToken: asset.vToken,
  };
};

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
