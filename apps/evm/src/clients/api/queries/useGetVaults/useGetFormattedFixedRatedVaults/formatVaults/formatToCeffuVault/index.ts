import BigNumber from 'bignumber.js';
import type {
  GetFixedRatedVaultUserStakedTokensOutput,
  GetFixedRatedVaultsOutput,
  GetInstitutionalVaultUserMetricsOutput,
} from 'clients/api';
import { type InstitutionalVault, type Token, VaultCategory, VaultManager, VaultType } from 'types';
import {
  convertDollarsToCents,
  convertMantissaToTokens,
  convertPriceMantissaToDollars,
  findTokenByAddress,
} from 'utilities';

import { getVaultStatus } from './getVaultStatus';

const CEFFU_MANAGER_LINK = 'https://www.ceffu.com';

export const formatToCeffuVault = ({
  vaultData,
  tokens,
  userStakedAmount,
  userMetric,
  nowMs,
}: {
  tokens: Token[];
  nowMs: number;
  vaultData: GetFixedRatedVaultsOutput[number];
  userStakedAmount?: GetFixedRatedVaultUserStakedTokensOutput[number];
  userMetric?: GetInstitutionalVaultUserMetricsOutput[number];
}): InstitutionalVault | undefined => {
  const loanVaultDetail = vaultData.loanVaultDetail;
  const stakedToken = findTokenByAddress({
    address: vaultData.underlyingAssetAddress,
    tokens,
  });

  if (!stakedToken || !loanVaultDetail) {
    return undefined;
  }

  const userStakeBalanceMantissa = userStakedAmount?.tokensMantissa ?? new BigNumber(0);
  const stakeBalanceMantissa = new BigNumber(loanVaultDetail.totalRaisedMantissa);
  const stakeLimitMantissa = new BigNumber(loanVaultDetail.maxBorrowCapMantissa);
  const stakeMinMantissa = new BigNumber(loanVaultDetail.minBorrowCapMantissa);
  const userRedeemLimitMantissa = userMetric?.maxRedeemAmountMantissa ?? new BigNumber(0);
  const userWithdrawLimitMantissa = userMetric?.maxWithdrawAmountMantissa ?? new BigNumber(0);
  let stakedTokenPriceCents = new BigNumber(100);
  const priceMantissa = vaultData.underlyingToken[0]?.tokenPrices?.[0]?.priceMantissa;

  if (priceMantissa) {
    stakedTokenPriceCents = convertDollarsToCents(
      convertPriceMantissaToDollars({
        priceMantissa: new BigNumber(priceMantissa),
        decimals: vaultData.underlyingToken[0].decimals,
      }),
    );
  }

  const userStakedTokens = convertMantissaToTokens({
    value: userStakeBalanceMantissa,
    token: stakedToken,
  });

  const stakeBalanceTokens = convertMantissaToTokens({
    value: stakeBalanceMantissa,
    token: stakedToken,
  });

  const openEndDate = loanVaultDetail.openEndTime
    ? new Date(loanVaultDetail.openEndTime)
    : undefined;

  const lockEndDate = loanVaultDetail.lockEndTime
    ? new Date(loanVaultDetail.lockEndTime)
    : undefined;

  const maturityDate = vaultData.maturityDate ? new Date(vaultData.maturityDate) : undefined;

  const settlementDate = loanVaultDetail.settlementDeadline
    ? new Date(loanVaultDetail.settlementDeadline)
    : undefined;

  return {
    key: vaultData.id,
    vaultType: VaultType.Institutional,
    category: VaultCategory.STABLECOINS,
    manager: VaultManager.Ceffu,
    managerIcon: 'ceefu',
    managerAddress: loanVaultDetail.institutionAddress,
    managerLink: CEFFU_MANAGER_LINK,
    status: getVaultStatus({
      loanVaultDetail,
      nowMs,
    }),
    stakedToken,
    rewardToken: stakedToken,
    stakedTokenPriceCents,
    rewardTokenPriceCents: stakedTokenPriceCents,
    stakingAprPercentage: new BigNumber(vaultData.fixedApyDecimal).shiftedBy(2).toNumber(),
    stakeBalanceMantissa,
    stakeBalanceCents: stakeBalanceTokens.times(stakedTokenPriceCents).toNumber(),
    userStakeBalanceMantissa,
    userStakeBalanceCents: userStakedTokens.times(stakedTokenPriceCents).toNumber(),
    vaultAddress: vaultData.vaultAddress,
    fixedApyDecimal: vaultData.fixedApyDecimal,
    vaultDeploymentDate: new Date(vaultData.createdAt),
    openEndDate,
    lockEndDate,
    settlementDate,
    maturityDate,
    stakeLimitMantissa,
    stakeMinMantissa,
    userRedeemLimitMantissa,
    userWithdrawLimitMantissa,
    lockingPeriodMs:
      'lockDurationSeconds' in vaultData.protocolData
        ? vaultData.protocolData.lockDurationSeconds * 1000
        : undefined,
  };
};
