import { usePostHog } from 'posthog-js/react';

import config from 'config';
import { logError } from 'packages/errors';
import { useChainId } from 'packages/wallet';

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
  | 'VAI vault reward claimed'
  | 'XVS vesting vault reward claimed'
  | 'Vote cast';

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
          routePath: string[];
        }
      : TEventName extends 'Tokens collateralized'
        ? {
            poolName: string;
            tokenSymbol: string;
            userSupplyBalanceTokens: number;
          }
        : TEventName extends 'Tokens decollateralized'
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
                      routePath: string[];
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
                        routePath: string[];
                      }
                    : TEventName extends 'Tokens staked in XVS vault'
                      ? {
                          poolIndex: number;
                          rewardTokenSymbol: string;
                          tokenAmountTokens: number;
                        }
                      : TEventName extends 'Token withdrawal requested from XVS vault'
                        ? {
                            poolIndex: number;
                            rewardTokenSymbol: string;
                            tokenAmountTokens: number;
                          }
                        : TEventName extends 'Token withdrawals executed from XVS vault'
                          ? {
                              poolIndex: number;
                              rewardTokenSymbol: string;
                            }
                          : TEventName extends 'Tokens staked in VAI vault'
                            ? {
                                tokenAmountTokens: number;
                              }
                            : TEventName extends 'Tokens withdrawn from VAI vault'
                              ? {
                                  tokenAmountTokens: number;
                                }
                              : TEventName extends 'Pool reward claimed'
                                ? {
                                    comptrollerAddress: string;
                                    vTokenAddressesWithPendingReward: string[];
                                  }
                                : TEventName extends 'XVS vesting vault reward claimed'
                                  ? {
                                      poolIndex: number;
                                      rewardTokenSymbol: string;
                                    }
                                  : TEventName extends 'Vote cast'
                                    ? { proposalId: number; voteType: string }
                                    : undefined;

const useAnalytics = () => {
  const posthog = usePostHog();
  const { chainId } = useChainId();

  function captureAnalyticEvent<TEventName extends AnalyticEventName>(
    eventName: TEventName,
    eventProps: AnalyticEventProps<TEventName>,
  ) {
    // Only send analytic events on mainnet
    if (config.environment !== 'mainnet') {
      return;
    }

    if (!posthog) {
      logError('Attempted to send analytic event but posthog object was undefined');
      return;
    }

    posthog.capture(eventName, { chainId, ...eventProps });
  }

  return {
    captureAnalyticEvent,
  };
};

export default useAnalytics;
