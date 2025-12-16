import { cn } from '@venusprotocol/ui';

import { BalanceUpdates, Delimiter } from 'components';
import { HEALTH_FACTOR_MODERATE_THRESHOLD } from 'constants/healthFactor';
import { HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE } from 'constants/swap';
import { AccountData } from 'containers/AccountData';
import { ConnectWallet } from 'containers/ConnectWallet';
import { SwapDetails } from 'containers/SwapDetails';
import { useAccountAddress } from 'libs/wallet';
import type { BalanceMutation, Pool, SwapQuote, Token } from 'types';
import { ApyBreakdown } from '../ApyBreakdown';
import { SubmitButton } from './SubmitButton';
import type { Approval } from './types';

export interface FooterProps {
  analyticVariant: string;
  balanceMutations: BalanceMutation[];
  pool: Pool;
  submitButtonLabel: string;
  isFormValid: boolean;
  approval?: Approval;
  isLoading?: boolean;
  swapFromToken?: Token;
  swapToToken?: Token;
  swapQuote?: SwapQuote;
  simulatedPool?: Pool;
  showApyBreakdown?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  balanceMutations,
  pool,
  simulatedPool,
  submitButtonLabel,
  swapFromToken,
  swapToToken,
  isLoading = false,
  analyticVariant,
  isFormValid,
  swapQuote,
  showApyBreakdown = true,
  approval,
}) => {
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  // Check if transaction is using a swap with a high price impact
  const isHighPriceImpactSwap =
    swapQuote?.priceImpactPercentage !== undefined &&
    swapQuote?.priceImpactPercentage >= HIGH_PRICE_IMPACT_THRESHOLD_PERCENTAGE;

  // Check if transaction would put user's health factor below moderate threshold
  const isRiskyTransaction =
    simulatedPool?.userHealthFactor !== undefined &&
    simulatedPool.userHealthFactor < HEALTH_FACTOR_MODERATE_THRESHOLD;

  const isRisky = isHighPriceImpactSwap || isRiskyTransaction;

  return (
    <div>
      {!isUserConnected && <ApyBreakdown pool={pool} balanceMutations={balanceMutations} />}

      <ConnectWallet
        className={cn('space-y-4', isUserConnected ? 'mt-2' : 'mt-6')}
        analyticVariant={analyticVariant}
      >
        <div className="space-y-4">
          <BalanceUpdates
            pool={pool}
            simulatedPool={simulatedPool}
            balanceMutations={balanceMutations}
          />

          <Delimiter />

          {showApyBreakdown && (
            <>
              <ApyBreakdown
                pool={pool}
                simulatedPool={simulatedPool}
                balanceMutations={balanceMutations}
                renderType="accordion"
              />

              <Delimiter />
            </>
          )}

          <AccountData pool={pool} simulatedPool={simulatedPool} />
        </div>

        <div className="space-y-3">
          <SubmitButton
            approval={approval}
            label={submitButtonLabel}
            isFormValid={isFormValid}
            isRisky={isRisky}
            isLoading={isLoading}
          />

          {swapFromToken && swapToToken && (
            <SwapDetails
              fromToken={swapFromToken}
              toToken={swapToToken}
              priceImpactPercentage={swapQuote?.priceImpactPercentage}
            />
          )}
        </div>
      </ConnectWallet>
    </div>
  );
};
