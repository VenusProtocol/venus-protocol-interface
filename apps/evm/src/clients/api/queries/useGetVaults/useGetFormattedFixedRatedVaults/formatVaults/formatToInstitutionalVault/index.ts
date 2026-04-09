import BigNumber from 'bignumber.js';
import type { GetFixedRatedVaultsOutput, LoanVaultDetail } from 'clients/api';
import {
  type Asset,
  type InstitutionalVault,
  type Pool,
  type Token,
  VaultCategory,
  VaultManager,
  VaultStatus,
} from 'types';
import {
  areAddressesEqual,
  convertMantissaToTokens,
  convertTokensToMantissa,
  findTokenByAddress,
} from 'utilities';
import type { Address } from 'viem';

const VAULT_STATE_MAP = {
  1: VaultStatus.Deposit,
  2: VaultStatus.Pending,
  3: VaultStatus.Earning,
  4: VaultStatus.Refund,
  5: VaultStatus.Repaying,
  6: VaultStatus.Claim,
};
export interface BaseInput {
  pools: Pool[];
  tokens: Token[];
}

export const formatToInstitutionalVault = ({
  vaultData,
  pools,
  tokens,
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

  const loanVaultDetail = vaultData?.loanVaultDetail as LoanVaultDetail;

  const stakedToken = findTokenByAddress({
    address: loanVaultDetail?.supplyAssetAddress as string,
    tokens,
  });

  const rewardToken = findTokenByAddress({
    address: loanVaultDetail?.collateralAssetAddress as string,
    tokens,
  });

  if (
    !stakedToken ||
    !rewardToken ||
    !asset ||
    !poolComptrollerContractAddress ||
    !poolName ||
    !loanVaultDetail
  ) {
    return undefined;
  }

  const maturityDate = new Date(vaultData.maturityDate);
  const status = VAULT_STATE_MAP[loanVaultDetail.vaultState as keyof typeof VAULT_STATE_MAP];

  const result: InstitutionalVault = {
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
    totalStakedCents: asset.supplyBalanceCents.toNumber(),
    userStakedCents: asset.userSupplyBalanceCents.toNumber(),
    stakedTokenPriceCents: new BigNumber(100),
    rewardTokenPriceCents: new BigNumber(100),
    maturityDate,
    vaultDeploymentDate: new Date(vaultData?.createdAt),
    liquidityCents: convertMantissaToTokens({
      value: new BigNumber(loanVaultDetail.liquidityMantissa ?? 0),
      token: stakedToken,
    }), // TODO: divide by price
    category: VaultCategory.Stablecoins,
    manager: VaultManager.Ceefu,
    managerIcon: 'ceefu' as const,
    managerAddress: loanVaultDetail.institutionAddress,
    managerLink: loanVaultDetail.institutionAddress
      ? `https://app.pendle.finance/trade/pools/${loanVaultDetail.institutionAddress}/zap/in?chain=bnbchain` // TODO: update link
      : undefined,
    status,
    asset,
    poolComptrollerContractAddress,
    poolName,
    openEndDate: new Date(),
    totalDepositedMantissa: new BigNumber(0),
    maxDepositedMantissa: new BigNumber(0),
    minRequestMantissa: new BigNumber(0),
  };

  return result;
};
