import BigNumber from 'bignumber.js';
import type { PendleVault, Pool, Token } from 'types';
import { VaultCategory, VaultManager, VaultStatus } from 'types';
import { areAddressesEqual, convertTokensToMantissa, findTokenByAddress } from 'utilities';
import type { GetVaultProductsOutput } from '../../getVaultProducts/types';

interface FormatToPendleVaultsInput {
  vaultProducts: GetVaultProductsOutput;
  pools: Pool[];
  tokens: Token[];
  now: number;
}

const formatVaultProduct = ({
  product,
  pools,
  tokens,
  now,
}: {
  product: GetVaultProductsOutput[number];
  pools: Pool[];
  tokens: Token[];
  now: number;
}) => {
  const asset = pools
    .flatMap(pool => pool.assets)
    .find(a => areAddressesEqual(a.vToken.address, product.vTokenAddress));

  const stakedToken = findTokenByAddress({
    address: product.underlyingAssetAddress,
    tokens,
  });

  const rewardToken = findTokenByAddress({
    address: product.protocolData?.accountingAsset?.address ?? '',
    tokens,
  });

  if (!stakedToken || !rewardToken || !asset) {
    return undefined;
  }

  const maturityDate = new Date(product.maturityDate).getTime();

  let status = VaultStatus.Deposit;
  if (now >= maturityDate) {
    status = VaultStatus.Claim;
  } else if (now < maturityDate && asset.userSupplyBalanceCents.gt(0)) {
    status = VaultStatus.Earning;
  }

  return {
    key: product.id,
    stakedToken,
    rewardToken,
    stakingAprPercentage: new BigNumber(product.fixedApyDecimal).shiftedBy(2).toNumber(),
    userStakedMantissa: convertTokensToMantissa({
      value: asset.userSupplyBalanceTokens,
      token: stakedToken,
    }),
    totalStakedMantissa: convertTokensToMantissa({
      value: asset.supplyBalanceTokens,
      token: stakedToken,
    }),
    lockingPeriodMs: maturityDate > now ? maturityDate - now : undefined,
    maturityDate,
    category: VaultCategory.YieldTokens,
    manager: VaultManager.Pendle,
    managerIcon: 'pendle' as const,
    status,
  };
};

export const formatToPendleVaults = ({
  vaultProducts,
  pools,
  tokens,
  now,
}: FormatToPendleVaultsInput): PendleVault[] =>
  vaultProducts.reduce<PendleVault[]>((acc, product) => {
    const vault = formatVaultProduct({ product, pools, tokens, now });
    if (vault) {
      acc.push(vault);
    }
    return acc;
  }, []);
