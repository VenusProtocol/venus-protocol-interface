import type { ChainId, Token } from '@venusprotocol/chains';
import type BigNumber from 'bignumber.js';
import type { VError } from 'libs/errors';
import type { Address, Hex } from 'viem';

export interface PendleGuessPtOut {
  guessMin: string;
  guessMax: string;
  guessOffchain: string;
  maxIteration: string;
  eps: string;
}

export interface PendleSwapData {
  swapType: string;
  extRouter: Address;
  extCalldata: Hex;
  needScale: boolean;
}

export interface PendleTokenDepositInput {
  tokenIn: Address;
  netTokenIn: string;
  tokenMintSy: Address;
  pendleSwap: Address;
  swapData: PendleSwapData;
}

export interface PendleTokenWithdrawInput {
  tokenOut: Address;
  minTokenOut: string;
  tokenRedeemSy: Address;
  pendleSwap: Address;
  swapData: PendleSwapData;
}

export interface PendleLimitOrder {
  salt: string;
  expiry: string;
  nonce: string;
  orderType: string;
  token: Address;
  YT: Address;
  maker: Address;
  receiver: Address;
  makingAmount: string;
  lnImpliedRate: string;
  failSafeRate: string;
  permit: Hex;
}

export interface PendleFillOrderParams {
  order: PendleLimitOrder;
  signature: Hex;
  makingAmount: string;
}

export interface PendleLimitOrderData {
  limitRouter: Address;
  epsSkipMarket: string;
  normalFills: PendleFillOrderParams[];
  flashFills: PendleFillOrderParams[];
  optData: Hex;
}

export type PendleContractDepositCallParams = [
  receiver: Address,
  market: Address,
  minPtOut: string,
  guessPtOut: PendleGuessPtOut,
  input: PendleTokenDepositInput,
  limit: PendleLimitOrderData,
];

export type PendleContractWithdrawCallParams = [
  receiver: Address,
  market: Address,
  minPtOut: string,
  input: PendleTokenWithdrawInput,
  limit: PendleLimitOrderData,
];

export interface PendleSwapApiResponse {
  pendleMarket: Address;
  method: string;
  contractCallParamsName: string[];
  contractCallParams: PendleContractDepositCallParams | PendleContractWithdrawCallParams;
  estimatedOutput: {
    token: Address;
    amount: string;
  };
  priceImpact: number;
  impliedApy: {
    before: number;
    after: number;
  };
  fee: {
    usd: string;
  };
  requiredApprovals: {
    token: Address;
    amount: string;
  }[];
}

export type PendleSwapQuoteError = VError<'pendleSwapQuote' | 'interaction'>;

export interface GetPendleSwapQuoteInput {
  chainId: ChainId;
  fromToken: Token;
  toToken: Token;
  amountTokens: BigNumber;
  slippagePercentage: number;
  receiverAddress?: Address;
}

export type GetPendleSwapQuoteOutput = {
  estimatedReceivedTokensMantissa: BigNumber;
  feeCents: BigNumber;
  priceImpactPercentage: number;
  pendleMarketAddress: Address;
} & Pick<
  PendleSwapApiResponse,
  'contractCallParams' | 'contractCallParamsName' | 'requiredApprovals'
>;
