import { BalanceUpdates, Delimiter } from 'components';
import { AccountPoolDailyEarnings } from 'containers/AccountPoolDailyEarnings';
import { AccountPoolHealth } from 'containers/AccountPoolHealth';
import type { BalanceMutation, Pool, Swap, SwapQuote, TokenAction } from 'types';
import { shouldShowAccountHealth } from 'utilities';
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

    <BalanceUpdates pool={pool} balanceMutations={balanceMutations} />

    {showApyBreakdown && (
      <>
        <Delimiter />

        <ApyBreakdown
          pool={pool}
          simulatedPool={simulatedPool}
          balanceMutations={balanceMutations}
          renderType="accordion"
        />
      </>
    )}

    <Delimiter />

    {shouldShowAccountHealth({ pool, simulatedPool }) && (
      <AccountPoolHealth pool={pool} simulatedPool={simulatedPool} />
    )}

    <AccountPoolDailyEarnings pool={pool} simulatedPool={simulatedPool} />
  </div>
);
