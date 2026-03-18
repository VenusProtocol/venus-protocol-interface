import type { ChainId, Token } from '@venusprotocol/chains';
import type { VError } from 'libs/errors';
import type { Address } from 'viem';

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
  extCalldata: string;
  needScale: boolean;
}

export interface PendleTokenInput {
  tokenIn: Address;
  netTokenIn: string;
  tokenMintSy: Address;
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
  permit: string;
}

export interface PendleFlashFill {
  order: PendleLimitOrder;
  signature: string;
  makingAmount: string;
}

export interface PendleLimitOrderData {
  limitRouter: Address;
  epsSkipMarket: string;
  normalFills: PendleFlashFill[];
  flashFills: PendleFlashFill[];
  optData: string;
}

export type PendleContractCallParams = [
  receiver: Address,
  market: Address,
  minPtOut: string,
  guessPtOut: PendleGuessPtOut,
  input: PendleTokenInput,
  limit: PendleLimitOrderData,
];

export interface PendleSwapApiResponse {
  pendleMarket: Address;
  method: string;
  contractCallParamsName: string[];
  contractCallParams: PendleContractCallParams;
  estimatedOutput: {
    token: Address;
    amount: string;
  };
  priceImpact: number;
  impliedApy: {
    before: number;
    after: number;
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
  amount: BigNumber;
  slippagePercentage: number;
  receiverAddress?: Address;
}

export type GetPendleSwapQuoteOutput = PendleSwapApiResponse;
