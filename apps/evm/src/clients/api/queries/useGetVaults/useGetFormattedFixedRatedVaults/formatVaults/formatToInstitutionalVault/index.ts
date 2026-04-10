import type { Token } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';
import type {
  GetFixedRatedVaultUserStakedTokensOutput,
  GetFixedRatedVaultsOutput,
} from 'clients/api';
import { type InstitutionalVault, VaultCategory, VaultManager, VaultType } from 'types';
import { convertMantissaToTokens, findTokenByAddress } from 'utilities';

import { getVaultStatus } from './getVaultStatus';

export interface BaseInput {
  tokens: Token[];
  nowMs: number;
}

export const formatToInstitutionalVault = ({
  vaultData,
  tokens,
  userStakedAmount,
  nowMs,
}: BaseInput & {
  vaultData: GetFixedRatedVaultsOutput[number];
  userStakedAmount?: GetFixedRatedVaultUserStakedTokensOutput[number];
}) => {
  const loanVaultDetail = vaultData?.loanVaultDetail;

  if (!loanVaultDetail) {
    return undefined;
  }

  const stakedToken = findTokenByAddress({
    address: loanVaultDetail.supplyAssetAddress,
    tokens,
  });

  if (!stakedToken) {
    return undefined;
  }

  const rewardToken = stakedToken;

  const status = getVaultStatus({
    loanVaultDetail,
    nowMs,
  });

  const userStakedMantissa = userStakedAmount?.tokensMantissa ?? new BigNumber(0);

  const userStakedTokens = convertMantissaToTokens({
    value: userStakedMantissa,
    token: stakedToken,
  });

  const totalStakedTokens = convertMantissaToTokens({
    value: new BigNumber(loanVaultDetail.totalRaisedMantissa),
    token: stakedToken,
  });

  const stakedTokenPriceCents = new BigNumber(100); // TODO: price
  const rewardTokenPriceCents = new BigNumber(100);

  const maturityDate = vaultData.maturityDate ? new Date(vaultData.maturityDate) : undefined;

  const result: InstitutionalVault = {
    key: vaultData.id,
    stakedToken,
    rewardToken,
    stakingAprPercentage: new BigNumber(vaultData.fixedApyDecimal).shiftedBy(2).toNumber(),
    userStakedMantissa,
    totalStakedMantissa: new BigNumber(loanVaultDetail.totalRaisedMantissa),
    userStakedCents: userStakedTokens.times(stakedTokenPriceCents).toNumber(),
    totalStakedCents: totalStakedTokens.times(stakedTokenPriceCents).toNumber(),
    stakedTokenPriceCents,
    rewardTokenPriceCents,
    vaultAddress: vaultData.vaultAddress,
    vaultDeploymentDate: new Date(vaultData?.createdAt),
    liquidityCents: convertMantissaToTokens({
      value: new BigNumber(loanVaultDetail.liquidityMantissa ?? 0),
      token: stakedToken,
    }), // TODO: times by price
    category: VaultCategory.Stablecoins,
    vaultType: VaultType.Institutional,
    manager: VaultManager.Ceefu,
    managerIcon: 'ceefu' as const,
    managerAddress: loanVaultDetail.institutionAddress,
    managerLink: 'https://www.matrixdock.com',
    status,
    poolComptrollerContractAddress: vaultData.vaultAddress,
    lockingPeriodMs: maturityDate ? maturityDate.getTime() - nowMs : undefined,
    openEndDate: loanVaultDetail.openEndTime ? new Date(loanVaultDetail.openEndTime) : undefined,
    lockEndDate: loanVaultDetail.lockEndTime ? new Date(loanVaultDetail.lockEndTime) : undefined,
    settlementDate: loanVaultDetail.settlementDeadline
      ? new Date(loanVaultDetail.settlementDeadline)
      : undefined,
    maturityDate,
    totalDepositedMantissa: new BigNumber(loanVaultDetail.totalRaisedMantissa),
    maxDepositedMantissa: new BigNumber(loanVaultDetail.maxBorrowCapMantissa),
    minRequestMantissa: new BigNumber(loanVaultDetail.minBorrowCapMantissa),
  };

  return result;
};
