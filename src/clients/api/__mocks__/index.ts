import { useQuery, useMutation, MutationObserverOptions } from 'react-query';

import fakeAddress from '__mocks__/models/address';
import FunctionKey from 'constants/functionKey';

// Queries
export const getVaiTreasuryPercentage = jest.fn();
export const useGetVaiTreasuryPercentage = () =>
  useQuery(FunctionKey.GET_VAI_TREASURY_PERCENTAGE, getVaiTreasuryPercentage);

export const getAssetsInAccount = jest.fn();
export const useGetAssetsInAccount = () =>
  useQuery(FunctionKey.GET_ASSETS_IN_ACCOUNT, getAssetsInAccount);

export const getHypotheticalAccountLiquidity = jest.fn();

export const getMarkets = jest.fn();
export const useGetMarkets = () => useQuery(FunctionKey.GET_MARKETS, getMarkets);

export const getMarketHistory = jest.fn();
export const useGetMarketHistory = () => useQuery(FunctionKey.GET_MARKET_HISTORY, getMarketHistory);

export const getVTokenBalancesAll = jest.fn();
export const useGetVTokenBalancesAll = jest.fn(() =>
  useQuery(FunctionKey.GET_V_TOKEN_BALANCES_ALL, getVTokenBalancesAll),
);

export const getMintedVai = jest.fn();
export const useGetMintedVai = () => useQuery(FunctionKey.GET_MINTED_VAI, getMintedVai);

export const getXvsReward = jest.fn();
export const useGetXvsReward = () => useQuery(FunctionKey.GET_XVS_REWARD, getXvsReward);

export const getVTokenBalanceOf = jest.fn();
export const useGetVTokenBalanceOf = () =>
  useQuery(FunctionKey.GET_V_TOKEN_BALANCE, getVTokenBalanceOf);

export const getVTokenBorrowBalance = jest.fn();
export const useGetVTokenBorrowBalance = () =>
  useQuery(FunctionKey.GET_V_TOKEN_BORROW_BALANCE, getVTokenBorrowBalance);

export const getAllowance = jest.fn();
export const useGetAllowance = () => useQuery(FunctionKey.GET_TOKEN_ALLOWANCE, getAllowance);

export const getBalanceOf = jest.fn();
export const useGetBalanceOf = () => useQuery(FunctionKey.GET_BALANCE_OF, getBalanceOf);

export const getVrtConversionEndTime = jest.fn();
export const useGetVrtConversionEndTime = () =>
  useQuery(FunctionKey.GET_VRT_CONVERSION_END_TIME, getVrtConversionEndTime);

export const getVrtConversionRatio = jest.fn();
export const useGetVrtConversionRatio = () =>
  useQuery(FunctionKey.GET_VRT_CONVERSION_RATIO, getVrtConversionRatio);

export const getXvsWithdrawableAmount = jest.fn();
export const useGetXvsWithdrawableAmount = () =>
  useQuery(FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT, getXvsWithdrawableAmount);

export const getVTokenCash = jest.fn();
export const useGetVTokenCash = () => useQuery(FunctionKey.GET_V_TOKEN_CASH, getVTokenCash);

export const getVTokenInterestRateModel = jest.fn();
export const useGetVTokenInterestRateModel = () =>
  useQuery(FunctionKey.GET_V_TOKEN_INTEREST_RATE_MODEL, getVTokenInterestRateModel);

export const getVTokenApySimulations = jest.fn();
export const useGetVTokenApySimulations = () =>
  useQuery(FunctionKey.GET_V_TOKEN_APY_SIMULATIONS, getVTokenApySimulations);

export const getVTokenSupplyRate = jest.fn();

export const getVTokenBorrowRate = jest.fn();

export const getVenusVaiVaultDailyRateWei = jest.fn();
export const useGetVenusVaiVaultDailyRateWei = () =>
  useQuery(FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE_WEI, getVenusVaiVaultDailyRateWei);

export const getTransactions = jest.fn();
export const useGetTransactions = jest.fn(() =>
  useQuery([FunctionKey.GET_TRANSACTIONS, {}], getTransactions),
);

export const getXvsVaultPoolsCount = jest.fn();
export const useGetXvsVaultPoolsCount = () =>
  useQuery(FunctionKey.GET_XVS_VAULT_POOLS_COUNT, getXvsVaultPoolsCount);

export const useGetTreasuryTotals = jest.fn();

export const useGetUserMarketInfo = jest.fn();

export const getXvsVaultPoolInfo = jest.fn();

export const getXvsVaultRewardWeiPerBlock = jest.fn();
export const useGetXvsVaultRewardWeiPerBlock = () =>
  useQuery(FunctionKey.GET_XVS_VAULT_REWARD_WEI_PER_BLOCK, getXvsVaultRewardWeiPerBlock);

export const getXvsVaultTotalAllocationPoints = jest.fn();
export const useGetXvsVaultTotalAllocationPoints = () =>
  useQuery(FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, getXvsVaultTotalAllocationPoints);

export const getXvsVaultPendingRewardWei = jest.fn();

export const getXvsVaultUserInfo = jest.fn();

export const getCurrentVotes = jest.fn();
export const useGetCurrentVotes = () => useQuery(FunctionKey.GET_CURRENT_VOTES, getCurrentVotes);

export const getProposals = jest.fn();
export const useGetProposals = () => useQuery(FunctionKey.GET_PROPOSALS, getProposals);

export const getProposal = jest.fn();
export const useGetProposal = () => useQuery(FunctionKey.GET_PROPOSAL, getProposal);

export const getDailyXvsWei = jest.fn();
export const useGetDailyXvsWei = () =>
  useQuery(FunctionKey.GET_V_TOKEN_DAILY_XVS_WEI, getDailyXvsWei);

export const getVoters = jest.fn();
export const useGetVoters = () => useQuery(FunctionKey.GET_VOTERS, getVoters);

export const getVoteReceipt = jest.fn();
export const useGetVoteReceipt = () => useQuery(FunctionKey.GET_VOTE_RECEIPT, getVoteReceipt);

export const useGetVaults = jest.fn();

export const getVaiVaultUserInfo = jest.fn();
export const useGetVaiVaultUserInfo = () =>
  useQuery([FunctionKey.GET_VAI_VAULT_USER_INFO, fakeAddress], getVaiVaultUserInfo);

export const getVaiVaultPendingXvsWei = jest.fn();
export const useGetVaiVaultPendingXvsWei = () =>
  useQuery([FunctionKey.GET_VAI_VAULT_PENDING_XVS_WEI, fakeAddress], getVaiVaultPendingXvsWei);

export const useGetVestingVaults = jest.fn();

export const getVoteDelegateAddress = jest.fn();
export const useGetVoteDelegateAddress = () =>
  useQuery([FunctionKey.GET_VOTE_DELEGATE_ADDRESS, fakeAddress], getVoteDelegateAddress);

export const getLatestProposalIdByProposer = jest.fn();
export const useGetLatestProposalIdByProposer = () =>
  useQuery(
    [FunctionKey.GET_LATEST_PROPOSAL_ID_BY_PROPOSER, fakeAddress],
    getLatestProposalIdByProposer,
  );
export const useGetActiveProposal = jest.fn();

export const getVrtVaultInterestRatePerBlock = jest.fn();
export const useGetVrtVaultInterestRatePerBlock = () =>
  useQuery(FunctionKey.GET_VRT_VAULT_INTEREST_RATE_WEI_PER_BLOCK, getVrtVaultInterestRatePerBlock);

export const getVrtVaultUserInfo = jest.fn();
export const useGetVrtVaultUserInfo = () =>
  useQuery([FunctionKey.GET_VRT_VAULT_USER_INFO, fakeAddress], getVrtVaultUserInfo);

export const getVrtVaultAccruedInterestWei = jest.fn();
export const useGetVrtVaultAccruedInterestWei = () =>
  useQuery(
    [FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST_WEI, fakeAddress],
    getVrtVaultAccruedInterestWei,
  );

export const getVoterAccounts = jest.fn();
export const useGetVoterAccounts = () => useQuery(FunctionKey.GET_VOTER_ACCOUNTS, getVoterAccounts);

// Mutations
export const approveToken = jest.fn();
export const useApproveToken = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.APPROVE_TOKEN, approveToken, options);

export const approveVrt = jest.fn();
export const useApproveVrt = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.APPROVE_VRT, approveVrt, options);

export const convertVrt = jest.fn();
export const useConvertVrt = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.CONVERT_VRT, approveVrt, options);

export const mintVai = jest.fn();
export const useMintVai = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.MINT_VAI, mintVai, options);

export const repayVai = jest.fn();
export const useRepayVai = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.REPAY_VAI, repayVai, options);

export const enterMarkets = jest.fn();
export const useEnterMarkets = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.ENTER_MARKETS, enterMarkets, options);

export const exitMarket = jest.fn();
export const useExitMarket = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.EXIT_MARKET, exitMarket, options);

export const claimXvsReward = jest.fn();
export const useClaimXvsReward = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.CLAIM_XVS_REWARD, claimXvsReward, options);

export const claimVaiVaultReward = jest.fn();
export const useClaimVaiVaultReward = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.CLAIM_VAI_VAULT_REWARD, claimVaiVaultReward, options);

export const claimXvsVaultReward = jest.fn();
export const useClaimXvsVaultReward = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.CLAIM_XVS_VAULT_REWARD, claimXvsVaultReward, options);

export const claimVrtVaultReward = jest.fn();
export const useClaimVrtVaultReward = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.CLAIM_VRT_VAULT_REWARD, claimVrtVaultReward, options);

export const repayBnb = jest.fn();
export const useRepayBnb = () => useMutation(FunctionKey.REPAY_BNB, repayBnb);

export const repayNonBnbVToken = jest.fn();
export const useRepayNonBnbVToken = () =>
  useMutation(FunctionKey.REPAY_NON_BNB_V_TOKEN, repayNonBnbVToken);

export const useRepayVToken = useRepayNonBnbVToken;

export const supply = jest.fn();
export const useSupply = () => useMutation(FunctionKey.SUPPLY, supply);
export const supplyNonBnb = jest.fn();
export const useSupplyNonBnb = () => useMutation(FunctionKey.SUPPLY, supplyNonBnb);

export const supplyBnb = jest.fn();
export const useSupplyBnb = () => useMutation(FunctionKey.SUPPLY_BNB, supplyBnb);

export const redeem = jest.fn();
export const useRedeem = () => useMutation(FunctionKey.REDEEM, redeem);

export const redeemUnderlying = jest.fn();
export const useRedeemUnderlying = () => useMutation(FunctionKey.REDEEM, redeemUnderlying);

export const borrowVToken = jest.fn();
export const useBorrowVToken = () => useMutation(FunctionKey.BORROW_V_TOKEN, borrowVToken);

export const withdrawXvs = jest.fn();
export const useWithdrawXvs = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.WITHDRAW_XVS, approveVrt, options);

export const setVoteDelegate = jest.fn();
export const useSetVoteDelegate = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.SET_VOTE_DELEGATE, setVoteDelegate, options);

export const createProposal = jest.fn();
export const useCreateProposal = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.CREATE_PROPOSAL, createProposal, options);

export const cancelProposal = jest.fn();
export const useCancelProposal = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.CANCEL_PROPOSAL, cancelProposal, options);

export const executeProposal = jest.fn();
export const useExecuteProposal = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.EXECUTE_PROPOSAL, executeProposal, options);

export const queueProposal = jest.fn();
export const useQueueProposal = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.QUEUE_PROPOSAL, queueProposal, options);

export const stakeInXvsVault = jest.fn();
export const useStakeInXvsVault = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.STAKE_IN_XVS_VAULT, stakeInXvsVault, options);

export const stakeInVaiVault = jest.fn();
export const useStakeInVaiVault = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.STAKE_IN_VAI_VAULT, stakeInVaiVault, options);

export const stakeInVrtVault = jest.fn();
export const useStakeInVrtVault = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.STAKE_IN_VRT_VAULT, stakeInVrtVault, options);

export const castVote = jest.fn();
export const useCastVote = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.CAST_VOTE, castVote, options);

export const castVoteWithReason = jest.fn();
export const useCastVoteWithReason = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.CAST_VOTE_WITH_REASON, castVoteWithReason, options);

export const withdrawFromVaiVault = jest.fn();
export const useWithdrawFromVaiVault = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.WITHDRAW_FROM_VAI_VAULT, withdrawFromVaiVault, options);

export const withdrawFromVrtVault = jest.fn();
export const useWithdrawFromVrtVault = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.WITHDRAW_FROM_VRT_VAULT, withdrawFromVrtVault, options);

export const requestWithdrawalFromXvsVault = jest.fn();
export const useRequestWithdrawalFromXvsVault = (options?: MutationObserverOptions) =>
  useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_XVS_VAULT,
    requestWithdrawalFromXvsVault,
    options,
  );

export const executeWithdrawalFromXvsVault = jest.fn();
export const useExecuteWithdrawalFromXvsVault = (options?: MutationObserverOptions) =>
  useMutation(
    FunctionKey.EXECUTE_WITHDRAWAL_FROM_XVS_VAULT,
    executeWithdrawalFromXvsVault,
    options,
  );

export const useVote = jest.fn(() => ({ vote: jest.fn() }));
