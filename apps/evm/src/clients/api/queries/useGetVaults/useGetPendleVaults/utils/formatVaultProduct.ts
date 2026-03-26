import BigNumber from 'bignumber.js';
import type { GetFixedRatedVaultsOutput } from 'clients/api';
import {
  type Asset,
  type PendleVault,
  type Pool,
  type Token,
  VaultCategory,
  VaultManager,
  VaultStatus,
} from 'types';
import { areAddressesEqual, convertTokensToMantissa, findTokenByAddress } from 'utilities';
import type { Address } from 'viem';

export interface BaseInput {
  pools: Pool[];
  tokens: Token[];
  now: number;
}

export const formatVaultProduct = ({
  vaultData,
  pools,
  tokens,
  now,
}: BaseInput & { vaultData: GetFixedRatedVaultsOutput[number] }) => {
  let asset: Asset | undefined;
  let poolComptrollerContractAddress: Address | undefined;
  let poolName: string | undefined;

  for (const pool of pools) {
    const targetAsset = pool.assets.find(
      _asset =>
        _asset && vaultData && areAddressesEqual(_asset?.vToken?.address, vaultData?.vaultAddress),
    );
    if (targetAsset) {
      asset = targetAsset;
      poolComptrollerContractAddress = pool.comptrollerAddress as Address;
      poolName = pool.name;
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

  if (!stakedToken || !rewardToken || !asset || !poolComptrollerContractAddress || !poolName) {
    return undefined;
  }

  const maturityDate = new Date(vaultData.maturityDate);
  const maturityTimestampMs = maturityDate.getTime();

  let status = VaultStatus.Deposit;
  if (now >= maturityTimestampMs) {
    status = VaultStatus.Claim;
  } else if (now < maturityTimestampMs && asset.userSupplyBalanceCents.gt(0)) {
    status = VaultStatus.Earning;
  }

  const result: PendleVault = {
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
    stakedTokenPriceCents: new BigNumber(vaultData.protocolData.ptTokenPriceUsd).shiftedBy(2),
    rewardTokenPriceCents: new BigNumber(
      vaultData.protocolData?.accountingAsset?.priceUsd,
    ).shiftedBy(2),
    maturityDate,
    vaultDeploymentDate: new Date(vaultData.protocolData?.startDate),
    liquidityCents: new BigNumber(vaultData.protocolData.liquidityCents),
    category: VaultCategory.YieldTokens,
    manager: VaultManager.Pendle,
    managerIcon: 'pendle' as const,
    managerAddress: vaultData.protocolData.pendleMarketAddress,
    managerLink: vaultData.protocolData.pendleMarketAddress
      ? `https://app.pendle.finance/trade/pools/${vaultData.protocolData.pendleMarketAddress}/zap/in?chain=bnbchain`
      : undefined,
    status,
    vToken: asset.vToken,
    poolComptrollerContractAddress,
    poolName,
  };

  return result;
};
