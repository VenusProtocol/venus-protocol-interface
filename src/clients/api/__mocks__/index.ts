import { useQuery, useMutation } from 'react-query';

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
  useQuery(FunctionKey.GET_HYPOTHETICAL_LIQUIDITY, getHypotheticalAccountLiquidity);

export const getMarkets = jest.fn();
export const useGetMarkets = () => useQuery(FunctionKey.GET_MARKETS, getMarkets);

export const getVTokenBalancesAll = jest.fn();
export const useGetVTokenBalancesAll = () =>
  useQuery(FunctionKey.GET_VTOKEN_BALANCES_ALL, getVTokenBalancesAll);

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

// Mutations
export const requestFaucetFunds = jest.fn();
export const useRequestFaucetFunds = () =>
  useMutation(FunctionKey.REQUEST_FAUCET_FUNDS, requestFaucetFunds);

export const mintVai = jest.fn();
export const useMintVai = () => useMutation(FunctionKey.MINT_VAI, mintVai);

export const repayVai = jest.fn();
export const useRepayVai = () => useMutation(FunctionKey.REPAY_VAI, repayVai);

export const enterMarkets = jest.fn();
export const useEnterMarkets = () => useMutation(FunctionKey.ENTER_MARKETS, enterMarkets);

export const exitMarket = jest.fn();
export const useExitMarket = () => useMutation(FunctionKey.EXIT_MARKET, exitMarket);

export const claimVenus = jest.fn();
