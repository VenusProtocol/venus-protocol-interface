import { BalanceUpdates, Delimiter } from 'components';
import { AccountData } from 'containers/AccountData';
import type { BalanceMutation, Pool, Swap, SwapQuote, TokenAction } from 'types';
import { ApyBreakdown } from '../ApyBreakdown';
import { SwapDetails } from './SwapDetails';

export interface OperationDetailsProps {
  action: TokenAction;
  pool: Pool;
  balanceMutations: BalanceMutation[];
  simulatedPool?: Pool;
  showApyBreakdown?: boolean;
  isUsingSwap?: boolean;
  swap?: Swap | SwapQuote;
}

export const OperationDetails: React.FC<OperationDetailsProps> = ({
  swap,
  action,
  isUsingSwap = false,
  pool,
  simulatedPool,
  showApyBreakdown = true,
  balanceMutations,
}) => (
  <div className="space-y-4">
    {/* TODO: move to submit section */}
    {isUsingSwap && swap && (action === 'supply' || action === 'repay') && (
      <>
        <SwapDetails action={action} swap={swap} />

        <Delimiter />
      </>
    )}

    <BalanceUpdates pool={pool} simulatedPool={simulatedPool} balanceMutations={balanceMutations} />

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
);
