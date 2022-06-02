import { useQuery, useMutation, MutationObserverOptions } from 'react-query';

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
export const useGetBalanceOf = () => useMutation(FunctionKey.GET_BALANCE_OF, getBalanceOf);

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

export const getVenusVaiVaultRate = jest.fn();
export const useGetVenusVaiVaultDailyRateWei = () =>
  useQuery(FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE_WEI, getVenusVaiVaultRate);

export const getTransactions = jest.fn();
export const useGetTransactions = () =>
  useQuery([FunctionKey.GET_TRANSACTIONS, {}], getTransactions);

export const getXvsVaultPoolsCount = jest.fn();
export const useGetXvsVaultPoolsCount = () =>
  useQuery(FunctionKey.GET_XVS_VAULT_POOL_LENGTH, getXvsVaultPoolsCount);

export const useGetTreasuryTotals = jest.fn();

export const useGetUserMarketInfo = jest.fn();

export const getXvsVaultPoolInfos = jest.fn();

export const getXvsVaultRewardTokenAmountsPerBlock = jest.fn();
export const useGetXvsVaultRewardWeiPerBlock = () =>
  useQuery(FunctionKey.GET_XVS_VAULT_REWARD_WEI_PER_BLOCK, getXvsVaultRewardTokenAmountsPerBlock);

export const getXvsVaultTotalAllocationPoints = jest.fn();
export const useGetXvsVaultTotalAllocationPoints = () =>
  useQuery(FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, getXvsVaultTotalAllocationPoints);

export const getXvsVaultRewardWeiPerBlock = jest.fn();

export const getXvsVaultPendingRewardWei = jest.fn();

export const getXvsVaultUserInfo = jest.fn();

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

export const requestFaucetFunds = jest.fn();
export const useRequestFaucetFunds = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.REQUEST_FAUCET_FUNDS, requestFaucetFunds, options);

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
