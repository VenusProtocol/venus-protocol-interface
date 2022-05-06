import { useQuery, useQueries, useMutation, MutationObserverOptions } from 'react-query';

import FunctionKey from 'constants/functionKey';

// Queries
export const getVaiTreasuryPercentage = jest.fn();
export const useGetVaiTreasuryPercentage = () =>
  useQuery(FunctionKey.GET_VAI_TREASURY_PERCENTAGE, getVaiTreasuryPercentage);

export const getAssetsInAccount = jest.fn();
export const useGetAssetsInAccount = () =>
  useQuery(FunctionKey.GET_ASSETS_IN_ACCOUNT, getAssetsInAccount);

export const getHypotheticalAccountLiquidity = jest.fn();
export const useGetHypotheticalLiquidityQueries = () =>
  useQueries([
    { queryKey: FunctionKey.GET_HYPOTHETICAL_LIQUIDITY, queryFn: getHypotheticalAccountLiquidity },
  ]);

export const getMarkets = jest.fn();
export const useGetMarkets = () => useQuery(FunctionKey.GET_MARKETS, getMarkets);

export const getVTokenBalancesAll = jest.fn();
export const useGetVTokenBalancesAll = () =>
  useQuery(FunctionKey.GET_V_TOKEN_BALANCES_ALL, getVTokenBalancesAll);

export const getVenusInitialIndex = jest.fn();
export const useGetVenusInitialIndex = () =>
  useQuery(FunctionKey.GET_VENUS_INITIAL_INDEX, getVenusInitialIndex);

export const getVenusAccrued = jest.fn();
export const useGetVenusAccrued = () => useQuery(FunctionKey.GET_VENUS_ACCRUED, getVenusAccrued);

export const getVenusVaiState = jest.fn();
export const useGetVenusVaiState = () =>
  useQuery(FunctionKey.GET_VENUS_VAI_STATE, getVenusVaiState);

export const getMintedVai = jest.fn();
export const useGetMintedVai = () => useQuery(FunctionKey.GET_MINTED_VAI, getMintedVai);

export const getVenusVaiMinterIndex = jest.fn();
export const useGetVenusVaiMinterIndex = () =>
  useQuery(FunctionKey.GET_VENUS_VAI_MINTER_INDEX, getMintedVai);

export const getXvsReward = jest.fn();
export const useGetXvsReward = () => useQuery(FunctionKey.GET_XVS_REWARD, getXvsReward);

export const getVTokenBalance = jest.fn();
export const useGetVTokenBalance = () =>
  useQuery(FunctionKey.GET_V_TOKEN_BALANCE, getVTokenBalance);

export const getVTokenBorrowBalance = jest.fn();
export const useGetVTokenBorrowBalance = () =>
  useMutation(FunctionKey.GET_V_TOKEN_BORROW_BALANCE, getVTokenBorrowBalance);

export const getAllowance = jest.fn();
export const useGetAllowance = () => useMutation(FunctionKey.GET_TOKEN_ALLOWANCE, getAllowance);

export const getVrtBalanceOf = jest.fn();
export const useGetBalanceOf = () => useMutation(FunctionKey.GET_BALANCE_OF, getVrtBalanceOf);

export const getVrtConversionEndTime = jest.fn();
export const useGetVrtConversionEndTime = () =>
  useMutation(FunctionKey.GET_VRT_CONVERSION_END_TIME, getVrtConversionEndTime);

export const getVrtConversionRatio = jest.fn();
export const useGetVrtConversionRatio = () =>
  useMutation(FunctionKey.GET_VRT_CONVERSION_RATIO, getVrtConversionRatio);

export const getXvsWithdrawableAmount = jest.fn();
export const useGetXvsWithdrawableAmount = () =>
  useMutation(FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT, getXvsWithdrawableAmount);

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

export const useUserMarketInfo = jest.fn();

export const borrowVToken = jest.fn();
export const useBorrowVToken = () => useMutation(FunctionKey.BORROW_V_TOKEN, borrowVToken);

export const withdrawXvs = jest.fn();
export const useWithdrawXvs = (options?: MutationObserverOptions) =>
  useMutation(FunctionKey.WITHDRAW_XVS, approveVrt, options);
