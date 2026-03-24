import BigNumber from 'bignumber.js';
import type { Asset, PendleVault, Pool, Token } from 'types';
import { VaultCategory, VaultManager, VaultStatus } from 'types';
import { areAddressesEqual, convertTokensToMantissa, findTokenByAddress } from 'utilities';
import type { Address } from 'viem';
import type { GetVaultProductsOutput } from '../../getVaultProducts/types';

interface BaseInput {
  pools: Pool[];
  tokens: Token[];
  now: number;
}

interface FormatToPendleVaultsInput extends BaseInput {
  vaultProducts: GetVaultProductsOutput;
}

const DEPLOY_DATE_MAP: Record<Address, number> = {
  '0x6d3BD68E90B42615cb5abF4B8DE92b154ADc435e': new Date('2025-10-09T09:04:39.000Z').getTime(),
};

const formatVaultProduct = ({
  vaultData,
  pools,
  tokens,
  now,
}: BaseInput & { vaultData: GetVaultProductsOutput[number] }) => {
  let asset: Asset | undefined;
  let poolComptrollerAddress: Address | undefined;

  for (const pool of pools) {
    const targetAsset = pool.assets.find(
      _asset =>
        _asset && vaultData && areAddressesEqual(_asset?.vToken?.address, vaultData?.vaultAddress),
    );
    if (targetAsset) {
      asset = targetAsset;
      poolComptrollerAddress = pool.comptrollerAddress as Address;
      break;
    }
  }

  const stakedToken = findTokenByAddress({
    address: vaultData.underlyingAssetAddress,
    tokens,
  });

  const rewardToken = findTokenByAddress({
    address: vaultData.protocolData?.accountingAsset?.address ?? '',
    tokens,
  });

  if (!stakedToken || !rewardToken || !asset || !poolComptrollerAddress) {
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
    managerLink: vaultData.protocolData.pendleMarketAddress
      ? `https://app.pendle.finance/trade/pools/${vaultData.protocolData.pendleMarketAddress}/zap/in?chain=bnbchain`
      : undefined,
    status,
    underlyingAssetAddress: vaultData.underlyingAssetAddress,
    vaultDeploymentTime: DEPLOY_DATE_MAP[vaultData.vaultAddress],
    vToken: asset.vToken,
    poolComptrollerAddress,
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
