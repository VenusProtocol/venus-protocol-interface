import { track } from '@vercel/analytics/react';
import type { ImportableProtocol } from 'types';
import type { Address } from 'viem';

export type AnalyticEventName =
  | 'Tokens supplied'
  | 'Tokens swapped and supplied'
  | 'Tokens collateralized'
  | 'Tokens decollateralized'
  | 'Tokens withdrawn'
  | 'Tokens borrowed'
  | 'Tokens repaid'
  | 'Tokens swapped and repaid'
  | 'Tokens swapped'
  | 'Tokens staked in XVS vault'
  | 'Token withdrawal requested from XVS vault'
  | 'Token withdrawals executed from XVS vault'
  | 'Tokens staked in VAI vault'
  | 'Tokens withdrawn from VAI vault'
  | 'Pool reward claimed'
  | 'Prime reward claimed'
  | 'VAI vault reward claimed'
  | 'XVS vesting vault reward claimed'
  | 'Vote cast'
  | 'Import positions modal displayed'
  | 'Import positions modal closed'
  | 'Position import initiated'
  | 'Position import failed'
  | 'Position imported';

export type AnalyticEventProps<TEventName extends AnalyticEventName> =
  TEventName extends 'Tokens supplied'
    ? { poolName: string; tokenSymbol: string; tokenAmountTokens: number }
    : TEventName extends 'Tokens swapped and supplied'
      ? {
          poolName: string;
          fromTokenSymbol: string;
          fromTokenAmountTokens: number;
          toTokenSymbol: string;
          toTokenAmountTokens: number;
          priceImpactPercentage: number;
          slippageTolerancePercentage: number;
          exchangeRate: number;
        }
      : TEventName extends 'Tokens collateralized' | 'Tokens decollateralized'
        ? {
            poolName: string;
            tokenSymbol: string;
            userSupplyBalanceTokens: number;
          }
        : TEventName extends 'Tokens withdrawn'
          ? {
              poolName: string;
              tokenSymbol: string;
              tokenAmountTokens: number;
              withdrewFullSupply: boolean;
            }
          : TEventName extends 'Tokens borrowed'
            ? {
                poolName: string;
                tokenSymbol: string;
                tokenAmountTokens: number;
              }
            : TEventName extends 'Tokens repaid'
              ? {
                  poolName: string;
                  tokenSymbol: string;
                  tokenAmountTokens: number;
                  repaidFullLoan: boolean;
                }
              : TEventName extends 'Tokens swapped and repaid'
                ? {
                    poolName: string;
                    fromTokenSymbol: string;
                    fromTokenAmountTokens: number;
                    toTokenSymbol: string;
                    toTokenAmountTokens: number;
                    priceImpactPercentage: number;
                    slippageTolerancePercentage: number;
                    exchangeRate: number;
                    repaidFullLoan: boolean;
                  }
                : TEventName extends 'Tokens swapped'
                  ? {
                      fromTokenSymbol: string;
                      fromTokenAmountTokens: number;
                      toTokenSymbol: string;
                      toTokenAmountTokens: number;
                      priceImpactPercentage: number;
                      slippageTolerancePercentage: number;
                      exchangeRate: number;
                    }
                  : TEventName extends
                        | 'Tokens staked in XVS vault'
                        | 'Token withdrawal requested from XVS vault'
                    ? {
                        poolIndex: number;
                        rewardTokenSymbol: string;
                        tokenAmountTokens: number;
                      }
                    : TEventName extends
                          | 'Token withdrawals executed from XVS vault'
                          | 'XVS vesting vault reward claimed'
                      ? {
                          poolIndex: number;
                          rewardTokenSymbol: string;
                        }
                      : TEventName extends
                            | 'Tokens staked in VAI vault'
                            | 'Tokens withdrawn from VAI vault'
                        ? {
                            tokenAmountTokens: number;
                          }
                        : TEventName extends 'Pool reward claimed'
                          ? {
                              comptrollerAddress: string;
                            }
                          : TEventName extends 'Vote cast'
                            ? { proposalId: number; voteType: string }
                            : TEventName extends
                                  | 'Position import initiated'
                                  | 'Position import failed'
                                  | 'Position imported'
                              ? {
                                  fromProtocol: ImportableProtocol;
                                  fromTokenSymbol: string;
                                  fromTokenAmountTokens: number;
                                  fromTokenAmountDollars: number;
                                  fromTokenApyPercentage: number;
                                  toVTokenAddress: Address;
                                  toTokenApyPercentage: number;
                                }
                              : undefined;

export const useAnalytics = () => {
  function captureAnalyticEvent<TEventName extends AnalyticEventName>(
    eventName: TEventName,
    eventProps: AnalyticEventProps<TEventName>,
  ) {
    track(eventName, eventProps);
  }

  return {
    captureAnalyticEvent,
  };
};
