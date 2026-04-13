import BigNumber from 'bignumber.js';
import type { GetFixedRatedVaultsOutput, PendleVaultProtocolData } from 'clients/api';
import {
  type Asset,
  type PendleVault,
  type Pool,
  type Token,
  VaultCategory,
  VaultManager,
  VaultStatus,
  VaultType,
} from 'types';
import { areAddressesEqual, convertTokensToMantissa, findTokenByAddress } from 'utilities';
import type { Address } from 'viem';

export interface BaseInput {
  pools: Pool[];
  tokens: Token[];
  nowMs: number;
}

export const formatToPendleVault = ({
  vaultData,
  pools,
  tokens,
  nowMs,
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
    }
  }

  const protocolData = vaultData?.protocolData as PendleVaultProtocolData;

  const stakedToken = findTokenByAddress({
    address: protocolData?.accountingAsset?.address ?? '',
    tokens,
  });

  const rewardToken = findTokenByAddress({
    address: vaultData.underlyingAssetAddress,
    tokens,
  });

  if (!stakedToken || !rewardToken || !asset || !poolComptrollerContractAddress || !poolName) {
    return undefined;
  }

  const modifiedRewardToken = {
    ...rewardToken,
    symbol: `${stakedToken.symbol} (Pendle PT)`,
    fullSymbol: `${rewardToken.symbol}`,
  };

  const maturityDate = new Date(vaultData.maturityDate);
  const maturityTimestampMs = maturityDate.getTime();

  let status = VaultStatus.Deposit;
  if (nowMs >= maturityTimestampMs) {
    status = VaultStatus.Claim;
  } else if (nowMs < maturityTimestampMs && asset.userSupplyBalanceCents.gt(0)) {
    status = VaultStatus.Earning;
  }

  const result: PendleVault = {
    key: vaultData.id,
    stakedToken,
    rewardToken: modifiedRewardToken,
    stakingAprPercentage: new BigNumber(vaultData.fixedApyDecimal).shiftedBy(2).toNumber(),
    userStakedMantissa: convertTokensToMantissa({
      value: asset.userSupplyBalanceTokens,
      token: asset.vToken.underlyingToken,
    }),
    totalStakedMantissa: convertTokensToMantissa({
      value: asset.supplyBalanceTokens,
      token: asset.vToken.underlyingToken,
    }),
    totalStakedCents: asset.supplyBalanceCents.toNumber(),
    userStakedCents: asset.userSupplyBalanceCents.toNumber(),
    stakedTokenPriceCents: new BigNumber(protocolData?.accountingAsset?.priceUsd).shiftedBy(2),
    rewardTokenPriceCents: new BigNumber(protocolData.ptTokenPriceUsd).shiftedBy(2),
    maturityDate,
    vaultDeploymentDate: new Date(protocolData?.startDate),
    liquidityCents: new BigNumber(protocolData.liquidityCents),
    category: VaultCategory.YieldTokens,
    vaultType: VaultType.Pendle,
    manager: VaultManager.Pendle,
    managerIcon: 'pendle' as const,
    managerAddress: protocolData.pendleMarketAddress,
    managerLink: protocolData.pendleMarketAddress
      ? `https://app.pendle.finance/trade/pools/${protocolData.pendleMarketAddress}/zap/in?chain=bnbchain`
      : undefined,
    status,
    asset,
    poolComptrollerContractAddress,
    poolName,
  };

  return result;
};
