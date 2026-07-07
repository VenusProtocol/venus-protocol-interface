import BigNumber from 'bignumber.js';
import type { GetFixedRatedVaultsOutput, GetInstitutionalVaultUserDataOutput } from 'clients/api';
import { type InstitutionalVault, type Token, VaultCategory, VaultType, VaultVenue } from 'types';
import {
  convertDollarsToCents,
  convertFactorFromSmartContract,
  convertMantissaToTokens,
  convertPriceMantissaToDollars,
  findTokenByAddress,
} from 'utilities';

import { getVenueConfig } from 'clients/api/queries/useGetVaults/getVenueConfig';
import { getUserYieldTokens } from './getUserYieldTokens';
import { getVaultStatus } from './getVaultStatus';

export const formatToInstitutionalVault = ({
  vaultData,
  tokens,
  userData,
  nowMs,
}: {
  tokens: Token[];
  nowMs: number;
  vaultData: GetFixedRatedVaultsOutput[number];
  userData?: GetInstitutionalVaultUserDataOutput[number];
}): InstitutionalVault | undefined => {
  const loanVaultDetail = vaultData.loanVaultDetail;
  const stakedToken = findTokenByAddress({
    address: vaultData.underlyingAssetAddress,
    tokens,
  });

  const collateralToken =
    loanVaultDetail &&
    findTokenByAddress({
      address: loanVaultDetail.collateralAssetAddress,
      tokens,
    });

  if (!stakedToken || !loanVaultDetail || !collateralToken) {
    return undefined;
  }

  const venue = getVenueConfig(loanVaultDetail.institutionName);

  const userStakeBalanceMantissa = userData?.tokensMantissa ?? new BigNumber(0);
  const stakeBalanceMantissa = new BigNumber(loanVaultDetail.totalRaisedMantissa);
  const stakeLimitMantissa = new BigNumber(loanVaultDetail.maxBorrowCapMantissa);
  const stakeMinMantissa = new BigNumber(loanVaultDetail.minBorrowCapMantissa);
  const userMinIndividualStakeMantissa = loanVaultDetail.minSupplierDepositMantissa
    ? new BigNumber(loanVaultDetail.minSupplierDepositMantissa)
    : undefined;
  const userRedeemLimitMantissa = userData?.maxRedeemAmountMantissa ?? new BigNumber(0);
  const userWithdrawLimitMantissa = userData?.maxWithdrawAmountMantissa ?? new BigNumber(0);
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

  const openStartDate = loanVaultDetail.openStartTime
    ? new Date(loanVaultDetail.openStartTime)
    : undefined;

  const lockEndDate = loanVaultDetail.lockEndTime
    ? new Date(loanVaultDetail.lockEndTime)
    : undefined;

  const maturityDate = vaultData.maturityDate ? new Date(vaultData.maturityDate) : undefined;

  const settlementDate = loanVaultDetail.settlementDeadline
    ? new Date(loanVaultDetail.settlementDeadline)
    : undefined;

  const reserveFactor = convertFactorFromSmartContract({
    factor: new BigNumber(loanVaultDetail.reserveFactorMantissa),
  });

  // We subtract the reserve factor from the APR to show the actual yields received by users
  const stakeAprPercentage = new BigNumber(vaultData.fixedApyDecimal)
    .multipliedBy(100)
    .multipliedBy(new BigNumber(1).minus(reserveFactor))
    .toNumber();

  const status = getVaultStatus({
    loanVaultDetail,
    userRedeemLimitMantissa,
    nowMs,
  });

  const userWithdrawTokens = convertMantissaToTokens({
    value: userWithdrawLimitMantissa,
    token: stakedToken,
  });

  const userYieldTokens = getUserYieldTokens({
    status,
    userStakedTokens,
    userWithdrawTokens,
    userWithdrawLimitMantissa,
  });

  return {
    key: vaultData.id,
    vaultType: VaultType.Institutional,
    category: VaultCategory.STABLECOINS,
    venue: VaultVenue.Matrixdock,
    venueName: venue.name,
    venueIconSrc: venue.iconSrc,
    venueAddress: loanVaultDetail.institutionAddress,
    venueUrl: venue.url,
    status,
    stakedToken,
    rewardToken: stakedToken,
    stakedTokenPriceCents,
    rewardTokenPriceCents: stakedTokenPriceCents,
    stakeAprPercentage,
    stakeBalanceMantissa,
    stakeBalanceCents: stakeBalanceTokens.times(stakedTokenPriceCents).toNumber(),
    userStakeBalanceMantissa,
    userStakeBalanceCents: userStakedTokens.times(stakedTokenPriceCents).toNumber(),
    userMinIndividualStakeMantissa,
    vaultAddress: vaultData.vaultAddress,
    vaultDeploymentDate: new Date(vaultData.createdAt),
    openStartDate,
    openEndDate,
    lockEndDate,
    settlementDate,
    maturityDate,
    stakeLimitMantissa,
    stakeMinMantissa,
    userRedeemLimitMantissa,
    ...(userYieldTokens !== undefined ? { userYieldTokens } : {}),
    userWithdrawLimitMantissa,
    reserveFactor,
    collateralToken,
    lockingPeriodMs:
      'lockDurationSeconds' in vaultData.protocolData
        ? vaultData.protocolData.lockDurationSeconds * 1000
        : undefined,
  };
};
