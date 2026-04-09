import { type ChainId, getToken } from '@venusprotocol/chains';
import BigNumber from 'bignumber.js';
import type {
  GetFixedRatedVaultUserStakedTokensOutput,
  GetFixedRatedVaultsOutput,
  LoanVaultDetail,
} from 'clients/api';
import {
  type InstitutionalVault,
  type Pool,
  VaultCategory,
  VaultManager,
  VaultStatus,
  VaultType,
} from 'types';
import { convertMantissaToTokens } from 'utilities';

const VAULT_STATE_MAP = {
  0: VaultStatus.Pending,
  1: VaultStatus.Pending,
  2: VaultStatus.Deposit,
  3: VaultStatus.Pending,
  4: VaultStatus.Earning,
  5: VaultStatus.Repaying,
  6: VaultStatus.Repaying,
  7: VaultStatus.Claim,
  8: VaultStatus.Refund,
  9: VaultStatus.Pending,
  10: VaultStatus.Inactive,
};
export interface BaseInput {
  pools: Pool[];
  chainId: ChainId;
}

export const formatToInstitutionalVault = ({
  vaultData,
  chainId,
  userStakedAmount,
}: BaseInput & {
  vaultData: GetFixedRatedVaultsOutput[number];
  userStakedAmount?: GetFixedRatedVaultUserStakedTokensOutput[number];
}) => {
  const loanVaultDetail = vaultData?.loanVaultDetail as LoanVaultDetail;

  const stakedToken = getToken({
    symbol: 'MOCK_USDC',
    chainId,
  });

  const rewardToken = stakedToken;

  console.log(stakedToken, rewardToken);

  if (!stakedToken || !rewardToken || !loanVaultDetail) {
    return undefined;
  }

  const status = VAULT_STATE_MAP[loanVaultDetail.vaultState as keyof typeof VAULT_STATE_MAP];

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
    openEndDate: loanVaultDetail.openEndTime ? new Date(loanVaultDetail.openEndTime) : undefined,
    lockEndDate: loanVaultDetail.lockEndTime ? new Date(loanVaultDetail.lockEndTime) : undefined,
    settlementDate: loanVaultDetail.settlementDeadline
      ? new Date(loanVaultDetail.settlementDeadline)
      : undefined,
    maturityDate: vaultData.maturityDate ? new Date(vaultData.maturityDate) : undefined,
    totalDepositedMantissa: new BigNumber(loanVaultDetail.totalRaisedMantissa),
    maxDepositedMantissa: new BigNumber(loanVaultDetail.maxBorrowCapMantissa),
    minRequestMantissa: new BigNumber(loanVaultDetail.minBorrowCapMantissa),
  };

  return result;
};
