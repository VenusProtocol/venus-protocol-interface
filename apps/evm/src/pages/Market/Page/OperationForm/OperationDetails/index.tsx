import type BigNumber from 'bignumber.js';
import { Delimiter } from 'components';
import { AccountData } from 'containers/AccountData';
import type { Asset, Pool, Swap, TokenAction } from 'types';
import { AssetInfo } from '../AssetInfo';
import SwapDetails from './SwapDetails';

export interface OperationDetailsProps {
  amountTokens: BigNumber;
  asset: Asset;
  action: TokenAction;
  isUsingSwap?: boolean;
  pool: Pool;
  swap?: Swap;
}

export const OperationDetails: React.FC<OperationDetailsProps> = ({
  swap,
  asset,
  action,
  isUsingSwap = false,
  amountTokens,
  pool,
}) => {
  const shouldShowAccountData =
    pool.userSupplyBalanceCents?.isGreaterThan(0) ||
    (action === 'supply' && amountTokens.isGreaterThan(0));

  return (
    <div className="space-y-4">
      {isUsingSwap && swap && (action === 'supply' || action === 'repay') && (
        <>
          <SwapDetails action={action} swap={swap} />

          <Delimiter />
        </>
      )}

      <AssetInfo
        asset={asset}
        action={action}
        swap={swap}
        isUsingSwap={isUsingSwap}
        amountTokens={amountTokens}
        renderType="accordion"
      />

      {shouldShowAccountData && (
        <>
          <Delimiter />

          <AccountData
            asset={asset}
            pool={pool}
            swap={swap}
            amountTokens={amountTokens}
            action={action}
            isUsingSwap={isUsingSwap}
          />
        </>
      )}
    </div>
  );
};
