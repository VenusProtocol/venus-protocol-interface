import {
  type MutationObserverOptions,
  type QueryObserverOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import fakeAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import { importablePositions } from '__mocks__/models/importablePositions';
import { poolData } from '__mocks__/models/pools';
import { primeEstimationData } from '__mocks__/models/primeEstimation';
import { transactions } from '__mocks__/models/transactions';
import { vaults } from '__mocks__/models/vaults';
import voters from '__mocks__/models/voters';

import FunctionKey from 'constants/functionKey';

import { proposals } from '__mocks__/models/proposals';
import type { Token, VToken } from 'types';
import type { Address } from 'viem';
import type { GetBalanceOfInput } from '../queries/getBalanceOf';
import type { GetTokenBalancesInput } from '../queries/getTokenBalances';
import type { GetVTokenBalancesInput } from '../queries/getVTokenBalances';

export const queryClient = {
  invalidateQueries: vi.fn(),
};

// Queries
export const getIsAddressAuthorized = vi.fn(async accountAddress => fakeAddress !== accountAddress);
export const useGetIsAddressAuthorized = vi.fn((accountAddress: Address) =>
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

export const getVaiTreasuryPercentage = vi.fn();
export const useGetVaiTreasuryPercentage = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_VAI_TREASURY_PERCENTAGE],
    queryFn: getVaiTreasuryPercentage,
  }),
);

export const getMarketHistory = vi.fn();
export const useGetMarketHistory = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_MARKET_HISTORY],
    queryFn: getMarketHistory,
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

export const getVTokenBalance = vi.fn();
export const useGetVTokenBalance = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_V_TOKEN_BALANCE],
    queryFn: getVTokenBalance,
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

export const useGetTokenBalances = vi.fn(
  (input: GetTokenBalancesInput, options?: Partial<QueryObserverOptions>) =>
    useQuery({
      queryKey: [FunctionKey.GET_TOKEN_BALANCES],
      queryFn: () => getTokenBalances(input),
      ...options,
    }),
);

export const getVTokenBalances = vi.fn(async ({ vTokens }: { vTokens: VToken[] }) => ({
  vTokenBalances: vTokens.map(vToken => ({
    vToken,
    balanceMantissa: new BigNumber('10000000000000000000'),
  })),
}));

export const useGetVTokenBalances = vi.fn(
  (input: GetVTokenBalancesInput, options?: Partial<QueryObserverOptions>) =>
    useQuery({
      queryKey: [FunctionKey.GET_VTOKEN_BALANCES],
      queryFn: () => getVTokenBalances(input),
      ...options,
    }),
);

export const getProposalMinQuorumVotes = vi.fn();
export const useGetProposalMinQuorumVotes = () =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_MIN_QUORUM_VOTES],
    queryFn: getProposalMinQuorumVotes,
  });

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

export const useGetPools = vi.fn(() => ({
  isLoading: false,
  data: {
    pools: poolData,
  },
}));

export const useGetPool = vi.fn(() => ({
  isLoading: false,
  data: {
    pool: poolData[0],
  },
}));

export const useGetSimulatedPool = vi.fn(() => ({
  isLoading: false,
  data: {
    pool: undefined,
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

export const getProposals = vi.fn(async () => ({
  proposals,
  total: 100,
}));
export const useGetProposals = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSALS],
    queryFn: getProposals,
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

export const getPaymasterInfo = vi.fn(async () => ({
  balanceMantissa: new BigNumber('100000000000000000'),
  canSponsorTransactions: true,
}));
export const useGetPaymasterInfo = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PAYMASTER_INFO],
    queryFn: getPaymasterInfo,
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

export const getAddressDomainName = vi.fn(async () => undefined);
export const useGetAddressDomainName = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_ADDRESS_DOMAIN_NAME],
    queryFn: getAddressDomainName,
  }),
);

export const getXvsVaultPendingWithdrawalsBalance = vi.fn(async () => ({
  balanceMantissa: 0,
}));

export const getBurnedWBnb = vi.fn(async () => ({
  burnedWBnbMantissa: 10000000000000000000000n,
}));
export const useGetBurnedWBnb = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_BURNED_BNB],
    queryFn: getBurnedWBnb,
  }),
);

export const getImportablePositions = vi.fn(async () => importablePositions);
export const useGetImportablePositions = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_IMPORTABLE_POSITIONS],
    queryFn: getImportablePositions,
  }),
);

export const getAccountPerformanceHistory = vi.fn(() => ({
  performanceHistory: [
    {
      blockNumber: 1,
      blockTimestampMs: 1714828100000,
      netWorthCents: 10000,
    },
    {
      blockNumber: 3,
      blockTimestampMs: 1714828200000,
      netWorthCents: 11000,
    },
    {
      blockNumber: 5,
      blockTimestampMs: 1714828300000,
      netWorthCents: 9000,
    },
    {
      blockNumber: 7,
      blockTimestampMs: 1714828400000,
      netWorthCents: 8000,
    },
    {
      blockNumber: 9,
      blockTimestampMs: 1714828500000,
      netWorthCents: 20000,
    },
  ],
  startOfDayNetWorthCents: 8500,
}));
export const useGetAccountPerformanceHistory = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_ACCOUNT_PERFORMANCE_HISTORY],
    queryFn: getAccountPerformanceHistory,
  }),
);

export const getAccountTransactionHistory = vi.fn(async () => transactions);
export const useGetAccountTransactionHistory = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_ACCOUNT_TRANSACTION_HISTORY],
    queryFn: getAccountTransactionHistory,
  }),
);

export const getSwapQuote = vi.fn(async () => ({
  swapQuote: undefined,
}));
export const useGetSwapQuote = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_SWAP_QUOTE],
    queryFn: getSwapQuote,
  }),
);

export const getMarketsTvl = vi.fn(async () => ({
  suppliedSumCents: '100000000000',
  borrowedSumCents: '10000000000',
  liquiditySumCents: '900000000000',
  marketCount: 99,
  poolCount: 9,
  chainCount: 12,
}));

export const useGetMarketsTvl = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_MARKETS_TVL],
    queryFn: getMarketsTvl,
  }),
);

export const getProposalCount = vi.fn(async () => ({
  proposalCount: 3,
}));
export const useGetProposalCount = vi.fn(() =>
  useQuery({
    queryKey: [FunctionKey.GET_PROPOSAL_COUNT],
    queryFn: getProposalCount,
  }),
);

// Mutations
export const useApproveToken = vi.fn((_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useMintVai = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useRepayVai = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useEnterMarket = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useExitMarket = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useRepay = vi.fn((_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useSupply = vi.fn((_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useWithdraw = vi.fn((_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useBorrow = vi.fn((_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useOpenLeveragedPosition = vi.fn(
  (_variables: never, options?: MutationObserverOptions) =>
    useMutation({
      mutationFn: vi.fn(),
      ...options,
    }),
);

export const useRepayWithCollateral = vi.fn(
  (_variables: never, options?: MutationObserverOptions) =>
    useMutation({
      mutationFn: vi.fn(),
      ...options,
    }),
);

export const withdrawXvs = vi.fn();
export const useWithdrawXvs = (options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: withdrawXvs,
    ...options,
  });

export const useSetVoteDelegate = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useCreateProposal = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useCancelProposal = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useExecuteProposal = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useQueueProposal = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useStakeInXvsVault = vi.fn((_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useStakeInVaiVault = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useVote = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useWithdrawFromVaiVault = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useRequestWithdrawalFromXvsVault = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useExecuteWithdrawalFromXvsVault = vi.fn(
  (_variables: never, options?: MutationObserverOptions) =>
    useMutation({
      mutationFn: vi.fn(),
      ...options,
    }),
);

export const useSwapTokens = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useSwapTokensAndRepay = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useSwapTokensAndSupply = vi.fn(
  (_variables: never, options?: MutationObserverOptions) =>
    useMutation({
      mutationFn: vi.fn(),
      ...options,
    }),
);

export const useClaimRewards = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useStakeInVault = vi.fn(() => ({
  stake: vi.fn(),
  isLoading: false,
}));

export const useClaimPrimeToken = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useBridgeXvs = vi.fn((options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);

export const useUpdatePoolDelegateStatus = vi.fn(
  (_variables: never, options?: MutationObserverOptions) =>
    useMutation({
      mutationFn: vi.fn(),
      ...options,
    }),
);

export const useImportSupplyPosition = vi.fn(
  (_variables: never, options?: MutationObserverOptions) =>
    useMutation({
      mutationFn: vi.fn(),
      ...options,
    }),
);

export const useSetEModeGroup = vi.fn((_variables: never, options?: MutationObserverOptions) =>
  useMutation({
    mutationFn: vi.fn(),
    ...options,
  }),
);
