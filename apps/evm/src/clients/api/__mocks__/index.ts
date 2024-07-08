import { type MutationObserverOptions, useMutation, useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { markets } from '__mocks__/models/markets';
import { poolData } from '__mocks__/models/pools';
import { primeEstimationData } from '__mocks__/models/primeEstimation';
import proposals from '__mocks__/models/proposals';
import vTokens from '__mocks__/models/vTokens';
import { vaults } from '__mocks__/models/vaults';
import voters from '__mocks__/models/voters';

import FunctionKey from 'constants/functionKey';

import { proposalPreviews } from '__mocks__/models/proposalPreviews';
import type { Token } from 'types';
import type { GetBalanceOfInput } from '../queries/getBalanceOf';
import type { GetTokenBalancesInput } from '../queries/getTokenBalances';

// Queries
export const getIsAddressAuthorized = vi.fn(async accountAddress => fakeAddress !== accountAddress);
export const useGetIsAddressAuthorized = vi.fn((accountAddress: string) =>
  useQuery({
    queryKey: [FunctionKey.GET_IS_ADDRESS_AUTHORIZED],
    queryFn: () => getIsAddressAuthorized(accountAddress),
  }),
);

export const getBlockNumber = vi.fn(async () => 51236217);
export const useGetBlockNumber = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_BLOCK_NUMBER],
    queryFn: getBlockNumber,
  }),
);

export const getVaiCalculateRepayAmount = vi.fn();
export const useGetVaiCalculateRepayAmount = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VAI_CALCULATE_REPAY_AMOUNT],
    queryFn: getVaiCalculateRepayAmount,
  }),
);

export const getVaiRepayAmountWithInterests = vi.fn();
export const useGetVaiRepayAmountWithInterests = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VAI_REPAY_AMOUNT_WITH_INTERESTS],
    queryFn: getVaiRepayAmountWithInterests,
  }),
);

export const getVaiTreasuryPercentage = vi.fn();
export const useGetVaiTreasuryPercentage = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VAI_TREASURY_PERCENTAGE],
    queryFn: getVaiTreasuryPercentage,
  }),
);

export const getHypotheticalAccountLiquidity = vi.fn();

export const getLegacyPoolMarkets = vi.fn(async () => ({ markets }));
export const useGetLegacyPoolMarkets = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_MAIN_MARKETS],
    queryFn: getLegacyPoolMarkets,
  }),
);

export const getMarketHistory = vi.fn();
export const useGetMarketHistory = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_MARKET_HISTORY],
    queryFn: getMarketHistory,
  }),
);

export const getVTokenBalancesAll = vi.fn();
export const useGetVTokenBalancesAll = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL],
    queryFn: getVTokenBalancesAll,
  }),
);

export const getMintableVai = vi.fn();
export const useGetMintableVai = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_MINTABLE_VAI],
    queryFn: getMintableVai,
  }),
);

export const getPendingRewards = vi.fn();
export const useGetPendingRewards = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PENDING_REWARDS],
    queryFn: getPendingRewards,
  }),
);

export const getVTokenBalanceOf = vi.fn();
export const useGetVTokenBalanceOf = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_V_TOKEN_BALANCE],
    queryFn: getVTokenBalanceOf,
  }),
);

export const getAllowance = vi.fn();
export const useGetAllowance = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_TOKEN_ALLOWANCE],
    queryFn: getAllowance,
  }),
);

export const getBalanceOf = vi.fn();
export const useGetBalanceOf = vi.fn((input: Omit<GetBalanceOfInput, 'signer'>) =>
  useQuery({
    queryKey: [
      FunctionKey.GET_BALANCE_OF,
      {
        accountAddress: input.accountAddress,
        tokenAddress: input.token?.address,
      },
    ],
    queryFn: () => getBalanceOf(input),
  }),
);

export const getTokenBalances = vi.fn(async ({ tokens }: { tokens: Token[] }) => ({
  tokenBalances: tokens.map(token => ({
    token,
    balanceMantissa: new BigNumber('10000000000000000000'),
  })),
}));

export const useGetTokenBalances = vi.fn((input: GetTokenBalancesInput) =>
  useQuery({
    queryKey: [FunctionKey.GET_TOKEN_BALANCES],
    queryFn: () => getTokenBalances(input),
  }),
);

export const getProposalMinQuorumVotes = vi.fn();
export const useGetProposalMinQuorumVotes = () =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_MIN_QUORUM_VOTES],
    queryFn: getProposalMinQuorumVotes,
  });

export const getVrtConversionEndTime = vi.fn();
export const useGetVrtConversionEndTime = () =>
  useQuery({
    queryKey: [FunctionKey.GET_VRT_CONVERSION_END_TIME],
    queryFn: getVrtConversionEndTime,
  });

export const getVrtConversionRatio = vi.fn();
export const useGetVrtConversionRatio = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VRT_CONVERSION_RATIO],
    queryFn: getVrtConversionRatio,
  }),
);

export const getXvsWithdrawableAmount = vi.fn();
export const useGetXvsWithdrawableAmount = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT],
    queryFn: getXvsWithdrawableAmount,
  }),
);

export const getVTokenInterestRateModel = vi.fn();
export const useGetVTokenInterestRateModel = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL],
    queryFn: getVTokenInterestRateModel,
  }),
);

export const getVTokenApySimulations = vi.fn();
export const useGetVTokenApySimulations = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_V_TOKEN_APY_SIMULATIONS],
    queryFn: getVTokenApySimulations,
  }),
);

export const getVTokenSupplyRate = vi.fn();

export const getVTokenBorrowRate = vi.fn();

export const getVenusVaiVaultDailyRate = vi.fn();
export const useGetVenusVaiVaultDailyRate = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE],
    queryFn: getVenusVaiVaultDailyRate,
  }),
);

export const getTransactions = vi.fn();
export const useGetTransactions = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_TRANSACTIONS],
    queryFn: getTransactions,
  }),
);

export const getXvsVaultPoolCount = vi.fn();
export const useGetXvsVaultPoolCount = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_POOLS_COUNT],
    queryFn: getXvsVaultPoolCount,
  }),
);

export const getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade = vi.fn();
export const useGetXvsVaultUserPendingWithdrawalsFromBeforeUpgrade = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_PENDING_WITHDRAWALS_FROM_BEFORE_UPGRADE],
    queryFn: getXvsVaultUserPendingWithdrawalsFromBeforeUpgrade,
  }),
);

export const useGetLegacyPoolTotalXvsDistributed = vi.fn();

export const useGetIsolatedPools = vi.fn(() => ({
  isLoading: false,
  data: {
    pools: poolData.slice(1),
  },
}));

export const getLegacyPool = vi.fn(async () => ({
  pool: poolData[0],
}));
export const useGetLegacyPool = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_LEGACY_POOL],
    queryFn: getLegacyPool,
  }),
);

export const useGetPool = vi.fn(() => ({
  isLoading: false,
  data: {
    pool: poolData[0],
  },
}));

export const useGetPools = vi.fn(() => ({
  isLoading: false,
  data: {
    pools: poolData,
  },
}));

export const useGetAsset = vi.fn(() => ({
  isLoading: false,
  data: {
    assets: assetData[0],
  },
}));

export const useGetVaults = vi.fn(() => ({
  isLoading: false,
  data: vaults,
}));

export const getXvsVaultPoolInfo = vi.fn();
export const useGetXvsVaultPoolInfo = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_POOL_INFOS],
    queryFn: getXvsVaultPoolInfo,
  }),
);

export const getXvsVaultsTotalDailyDistributedXvs = vi.fn();
export const useGetXvsVaultsTotalDailyDistributedXvs = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_DAILY_REWARD_TOKENS],
    queryFn: getXvsVaultsTotalDailyDistributedXvs,
  }),
);

export const getXvsVaultTotalAllocationPoints = vi.fn();
export const useGetXvsVaultTotalAllocationPoints = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS],
    queryFn: getXvsVaultTotalAllocationPoints,
  }),
);

export const getXvsVaultLockedDeposits = vi.fn();
export const useGetXvsVaultLockedDeposits = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS],
    queryFn: getXvsVaultLockedDeposits,
  }),
);

export const getXvsVaultUserInfo = vi.fn(() => ({
  stakedAmountMantissa: new BigNumber('1000000'),
}));

export const useGetXvsVaultUserInfo = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_USER_INFO],
    queryFn: getXvsVaultUserInfo,
  }),
);

export const getCurrentVotes = vi.fn(async () => ({
  votesMantissa: new BigNumber(100000000000000000),
}));
export const useGetCurrentVotes = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_CURRENT_VOTES],
    queryFn: getCurrentVotes,
  }),
);

export const getProposalPreviews = vi.fn(async () => ({
  proposalPreviews,
}));
export const useGetProposalPreviews = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_PREVIEWS],
    queryFn: getProposalPreviews,
  }),
);

export const getProposal = vi.fn(async () => proposals[0]);
export const useGetProposal = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL],
    queryFn: getProposal,
  }),
);

export const getVoters = vi.fn(async () => voters);
export const useGetVoters = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTERS],
    queryFn: getVoters,
  }),
);

export const getVoterHistory = vi.fn();
export const useGetVoterHistory = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTER_HISTORY],
    queryFn: getVoterHistory,
  }),
);

export const getVoterDetails = vi.fn();
export const useGetVoterDetails = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTER_DETAILS],
    queryFn: getVoterDetails,
  }),
);

export const getVoteReceipt = vi.fn();
export const useGetVoteReceipt = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTE_RECEIPT],
    queryFn: getVoteReceipt,
  }),
);

export const getVaiVaultUserInfo = vi.fn();
export const useGetVaiVaultUserInfo = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VAI_VAULT_USER_INFO],
    queryFn: getVaiVaultUserInfo,
  }),
);

export const useGetVestingVaults = vi.fn(() => ({
  data: [],
  isLoading: false,
}));

export const getVoteDelegateAddress = vi.fn();
export const useGetVoteDelegateAddress = () =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTE_DELEGATE_ADDRESS, fakeAddress],
    queryFn: getVoteDelegateAddress,
  });

export const getLatestProposalIdByProposer = vi.fn();
export const useGetLatestProposalIdByProposer = () =>
  useQuery({
    queryKey: [FunctionKey.GET_LATEST_PROPOSAL_ID_BY_PROPOSER, fakeAddress],
    queryFn: getLatestProposalIdByProposer,
  });
export const useGetActiveProposal = vi.fn();

export const getVoterAccounts = vi.fn();
export const useGetVoterAccounts = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VOTER_ACCOUNTS],
    queryFn: getVoterAccounts,
  }),
);

export const getProposalThreshold = vi.fn(async () => new BigNumber('10000000000000000000000'));
export const useGetProposalThreshold = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_THRESHOLD],
    queryFn: getProposalThreshold,
  }),
);

export const getProposalState = vi.fn();
export const useGetProposalState = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_STATE],
    queryFn: getProposalState,
  }),
);

export const getProposalEta = vi.fn();
export const useGetProposalEta = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_ETA],
    queryFn: getProposalEta,
  }),
);

export const getPancakeSwapPairs = vi.fn();
export const useGetPancakeSwapPairs = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PANCAKE_SWAP_PAIRS],
    queryFn: getPancakeSwapPairs,
  }),
);

export const getVaiRepayApr = vi.fn();
export const useGetVaiRepayApr = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VAI_REPAY_APR],
    queryFn: getVaiRepayApr,
  }),
);

export const getVTokens = vi.fn(async () => ({
  vTokens,
}));
export const useGetVTokens = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VTOKENS],
    queryFn: getVTokens,
  }),
);

export const getPrimeToken = vi.fn(async () => ({
  isAccountPrime: false,
}));
export const useGetPrimeToken = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PRIME_TOKEN],
    queryFn: getPrimeToken,
  }),
);

export const getPrimeStatus = vi.fn(async () => ({}));
export const useGetPrimeStatus = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PRIME_STATUS],
    queryFn: getPrimeStatus,
  }),
);

export const getHypotheticalPrimeApys = vi.fn();
export const useGetHypotheticalPrimeApys = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_HYPOTHETICAL_PRIME_APYS],
    queryFn: getHypotheticalPrimeApys,
  }),
);

export const getLatestAppVersion = vi.fn();
export const useGetLatestAppVersion = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_LATEST_APP_VERSION],
    queryFn: getLatestAppVersion,
  }),
);

export const getTokenUsdPrice = vi.fn(async () => ({ tokenPriceUsd: new BigNumber('1') }));
export const useGetTokenUsdPrice = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_TOKEN_USD_PRICE],
    queryFn: getTokenUsdPrice,
  }),
);

export const getPrimeEstimation = vi.fn(async () => primeEstimationData);
export const useGetPrimeEstimation = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PRIME_ESTIMATION],
    queryFn: getPrimeEstimation,
  }),
);

export const getPrimeDistributionForMarket = vi.fn(async () => ({
  totalDistributedMantissa: new BigNumber('1230000000000000000000000'),
}));
export const useGetPrimeDistributionForMarket = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PRIME_DISTRIBUTION_FOR_MARKET],
    queryFn: getPrimeDistributionForMarket,
  }),
);

export const getVaiVaultPaused = vi.fn(async () => ({
  isVaultPaused: false,
}));
export const useGetVaiVaultPaused = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VAI_VAULT_PAUSED],
    queryFn: getVaiVaultPaused,
  }),
);

export const getXvsVaultPaused = vi.fn(async () => ({
  isVaultPaused: false,
}));
export const useGetXvsVaultPaused = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_PAUSED],
    queryFn: getXvsVaultPaused,
  }),
);

export const getXvsBridgeFeeEstimation = vi.fn(async () => ({
  estimatedFeeMantissa: new BigNumber('12000000'),
}));
export const useGetXvsBridgeFeeEstimation = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_BRIDGE_FEE_ESTIMATION],
    queryFn: getXvsBridgeFeeEstimation,
  }),
);

export const getXvsBridgeStatus = vi.fn(async () => ({
  dailyLimitResetTimestamp: new BigNumber('0'),
  maxDailyLimitUsd: new BigNumber('0'),
  totalTransferredLast24HourUsd: new BigNumber('0'),
  maxSingleTransactionLimitUsd: new BigNumber('0'),
}));
export const useGetXvsBridgeStatus = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_BRIDGE_STATUS],
    queryFn: getXvsBridgeStatus,
  }),
);

export const getXvsBridgeMintStatus = vi.fn(async () => ({
  minterToCapMantissa: new BigNumber('500000000000000000000000'),
  bridgeAmountMintedMantissa: new BigNumber('10000000000000000'),
}));
export const useGetXvsBridgeMintStatus = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_XVS_BRIDGE_MINT_STATUS],
    queryFn: getXvsBridgeMintStatus,
  }),
);

export const getPoolDelegateApprovalStatus = vi.fn(async () => undefined);
export const useGetPoolDelegateApprovalStatus = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_POOL_DELEGATE_APPROVAL_STATUS],
    queryFn: getPoolDelegateApprovalStatus,
  }),
);

export const getVTokenUtilizationRate = vi.fn(async () => ({
  utilizationRatePercentage: 10,
}));
export const useGetVTokenUtilizationRate = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_V_TOKEN_UTILIZATION_RATE],
    queryFn: getVTokenUtilizationRate,
  }),
);

export const getPoolLiquidationIncentive = vi.fn(async () => ({
  liquidationIncentivePercentage: 10,
}));
export const useGetPoolLiquidationIncentive = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_POOL_LIQUIDATION_INCENTIVE],
    queryFn: getPoolLiquidationIncentive,
  }),
);

export const getIsolatedPoolVTokenLiquidationThreshold = vi.fn(async () => ({
  liquidationThresholdPercentage: 10,
}));
export const useGetIsolatedPoolVTokenLiquidationThreshold = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_ISOLATED_POOL_V_TOKEN_LIQUIDATION_THRESHOLD],
    queryFn: getIsolatedPoolVTokenLiquidationThreshold,
  }),
);

export const getXvsVaultPendingWithdrawalsBalance = vi.fn(async () => ({
  balanceMantissa: 0,
}));

export const getSwapQuote = vi.fn(async () => ({
  swap: undefined,
  error: undefined,
}));
export const useGetSwapQuote = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_SWAP_QUOTE],
    queryFn: getSwapQuote,
  }),
);

// Mutations
export const approveToken = vi.fn();
export const useApproveToken = (_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.APPROVE_TOKEN],
    mutationFn: approveToken,
    ...options,
  });

export const revokeSpendingLimit = vi.fn();
export const useRevokeSpendingLimit = (_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.REVOKE_SPENDING_LIMIT],
    mutationFn: revokeSpendingLimit,
    ...options,
  });

export const convertVrt = vi.fn();
export const useConvertVrt = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.CONVERT_VRT],
    mutationFn: convertVrt,
    ...options,
  });

export const mintVai = vi.fn();
export const useMintVai = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.MINT_VAI],
    mutationFn: mintVai,
    ...options,
  });

export const repayVai = vi.fn();
export const useRepayVai = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.REPAY_VAI],
    mutationFn: repayVai,
    ...options,
  });

export const enterMarket = vi.fn();
export const useEnterMarket = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.ENTER_MARKET],
    mutationFn: enterMarket,
    ...options,
  });

export const exitMarket = vi.fn();
export const useExitMarket = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.EXIT_MARKET],
    mutationFn: exitMarket,
    ...options,
  });

export const repay = vi.fn();
export const useRepay = (_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.REPAY],
    mutationFn: repay,
    ...options,
  });

export const supply = vi.fn();
export const useSupply = (_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.SUPPLY],
    mutationFn: supply,
    ...options,
  });

export const withdraw = vi.fn();
export const useWithdraw = (_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.WITHDRAW],
    mutationFn: withdraw,
    ...options,
  });

export const borrow = vi.fn();
export const useBorrow = (_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.BORROW],
    mutationFn: borrow,
    ...options,
  });

export const withdrawXvs = vi.fn();
export const useWithdrawXvs = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.WITHDRAW_XVS],
    mutationFn: withdrawXvs,
    ...options,
  });

export const setVoteDelegate = vi.fn();
export const useSetVoteDelegate = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.SET_VOTE_DELEGATE],
    mutationFn: setVoteDelegate,
    ...options,
  });

export const createProposal = vi.fn();
export const useCreateProposal = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.CREATE_PROPOSAL],
    mutationFn: createProposal,
    ...options,
  });

export const cancelProposal = vi.fn(async () => fakeContractTransaction);
export const useCancelProposal = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.CANCEL_PROPOSAL],
    mutationFn: cancelProposal,
    ...options,
  });

export const executeProposal = vi.fn(async () => fakeContractTransaction);
export const useExecuteProposal = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.EXECUTE_PROPOSAL],
    mutationFn: executeProposal,
    ...options,
  });

export const queueProposal = vi.fn(async () => fakeContractTransaction);
export const useQueueProposal = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.QUEUE_PROPOSAL],
    mutationFn: queueProposal,
    ...options,
  });

export const stakeInXvsVault = vi.fn();
export const useStakeInXvsVault = (_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.STAKE_IN_XVS_VAULT],
    mutationFn: stakeInXvsVault,
    ...options,
  });

export const stakeInVaiVault = vi.fn();
export const useStakeInVaiVault = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.STAKE_IN_VAI_VAULT],
    mutationFn: stakeInVaiVault,
    ...options,
  });

export const castVote = vi.fn();
export const useCastVote = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.CAST_VOTE],
    mutationFn: castVote,
    ...options,
  });

export const castVoteWithReason = vi.fn();
export const useCastVoteWithReason = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.CAST_VOTE_WITH_REASON],
    mutationFn: castVoteWithReason,
    ...options,
  });

export const withdrawFromVaiVault = vi.fn();
export const useWithdrawFromVaiVault = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.WITHDRAW_FROM_VAI_VAULT],
    mutationFn: withdrawFromVaiVault,
    ...options,
  });

export const requestWithdrawalFromXvsVault = vi.fn();
export const useRequestWithdrawalFromXvsVault = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.REQUEST_WITHDRAWAL_FROM_XVS_VAULT],
    mutationFn: requestWithdrawalFromXvsVault,
    ...options,
  });

export const executeWithdrawalFromXvsVault = vi.fn();
export const useExecuteWithdrawalFromXvsVault = (
  _variables: never,
  options?: MutationObserverOptions,
) =>
  useMutation({
    mutationKey: [FunctionKey.EXECUTE_WITHDRAWAL_FROM_XVS_VAULT],
    mutationFn: executeWithdrawalFromXvsVault,
    ...options,
  });

export const swapTokens = vi.fn(async () => fakeContractTransaction);
export const useSwapTokens = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.SWAP_TOKENS],
    mutationFn: swapTokens,
    ...options,
  });

export const swapTokensAndRepay = vi.fn(async () => fakeContractTransaction);
export const useSwapTokensAndRepay = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.SWAP_TOKENS_AND_REPAY],
    mutationFn: swapTokensAndRepay,
    ...options,
  });

export const swapTokensAndSupply = vi.fn(async () => fakeContractTransaction);
export const useSwapTokensAndSupply = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.SWAP_TOKENS_AND_SUPPLY],
    mutationFn: swapTokensAndSupply,
    ...options,
  });

export const claimRewards = vi.fn();
export const useClaimRewards = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.CLAIM_REWARDS],
    mutationFn: claimRewards,
    ...options,
  });

export const stake = vi.fn();
export const useStakeInVault = () => ({
  stake,
  isLoading: false,
});

export const claimPrimeToken = vi.fn();
export const useClaimPrimeToken = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.CLAIM_PRIME_TOKEN],
    mutationFn: claimPrimeToken,
    ...options,
  });

export const bridgeXvs = vi.fn();
export const useBridgeXvs = (options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.BRIDGE_XVS],
    mutationFn: bridgeXvs,
    ...options,
  });

export const updatePoolDelegateStatus = vi.fn();
export const useUpdatePoolDelegateStatus = (_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationKey: [FunctionKey.UPDATE_POOL_DELEGATE_STATUS],
    mutationFn: updatePoolDelegateStatus,
    ...options,
  });
