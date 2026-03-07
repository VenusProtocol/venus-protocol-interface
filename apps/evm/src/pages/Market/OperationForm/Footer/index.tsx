import { BalanceUpdates, Delimiter } from 'components';
import { AccountData } from 'containers/AccountData';
import { TxFormSubmitButton } from 'containers/TxFormSubmitButton';
import { useAccountAddress } from 'libs/wallet';
import type { BalanceMutation, Pool, SwapQuote, Token } from 'types';
import { ApyBreakdown } from '../ApyBreakdown';
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
  isUserAcknowledgingRisk?: boolean;
  setAcknowledgeRisk?: (checked: boolean) => void;
  isUserAcknowledgingHighPriceImpact?: boolean;
  setAcknowledgeHighPriceImpact?: (checked: boolean) => void;
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
  isUserAcknowledgingRisk,
  setAcknowledgeRisk,
  isUserAcknowledgingHighPriceImpact,
  setAcknowledgeHighPriceImpact,
}) => {
  const { accountAddress } = useAccountAddress();
  const isUserConnected = !!accountAddress;

  return (
    <div className="space-y-4">
      {isUserConnected ? (
        <>
          <BalanceUpdates pool={pool} balanceMutations={balanceMutations} />

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
        </>
      ) : (
        <ApyBreakdown pool={pool} balanceMutations={balanceMutations} />
      )}

      <TxFormSubmitButton
        approval={approval}
        submitButtonLabel={submitButtonLabel}
        isFormValid={isFormValid}
        simulatedPool={simulatedPool}
        balanceMutations={balanceMutations}
        isUserAcknowledgingRisk={isUserAcknowledgingRisk}
        setAcknowledgeRisk={setAcknowledgeRisk}
        isUserAcknowledgingHighPriceImpact={isUserAcknowledgingHighPriceImpact}
        setAcknowledgeHighPriceImpact={setAcknowledgeHighPriceImpact}
        isLoading={isLoading}
        swapFromToken={swapFromToken}
        swapToToken={swapToToken}
        swapQuote={swapQuote}
        analyticVariant={analyticVariant}
      />
    </div>
  );
};
