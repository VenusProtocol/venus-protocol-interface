import { cn } from '@venusprotocol/ui';
import { useState } from 'react';
import type { Token } from 'types';

import { PairInfoBar } from './PairInfoBar';
import { PositionsTable } from './PositionsTable';
import { TokenPairSelector } from './TokenPairSelector';
import { TradingViewChart } from './TradingViewChart';

export interface LeftPanelProps {
  longToken: Token;
  shortToken: Token;
  availableTokens: Token[];
  onLongTokenChange: (token: Token) => void;
  onShortTokenChange: (token: Token) => void;
  isWalletConnected: boolean;
  longLiquidityUsd?: string;
  shortLiquidityUsd?: string;
  longSupplyApyPercentage?: string;
  shortBorrowApyPercentage?: string;
  className?: string;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  longToken,
  shortToken,
  availableTokens,
  onLongTokenChange,
  onShortTokenChange,
  isWalletConnected,
  longLiquidityUsd,
  shortLiquidityUsd,
  longSupplyApyPercentage,
  shortBorrowApyPercentage,
  className,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <TokenPairSelector
        longToken={longToken}
        shortToken={shortToken}
        availableTokens={availableTokens}
        onLongTokenChange={onLongTokenChange}
        onShortTokenChange={onShortTokenChange}
        onDropdownOpenChange={setIsDropdownOpen}
      />

      <PairInfoBar
        longToken={longToken}
        shortToken={shortToken}
        longLiquidityUsd={longLiquidityUsd}
        shortLiquidityUsd={shortLiquidityUsd}
        longSupplyApyPercentage={longSupplyApyPercentage}
        shortBorrowApyPercentage={shortBorrowApyPercentage}
      />

      <TradingViewChart
        longToken={longToken}
        shortToken={shortToken}
        blockPointerEvents={isDropdownOpen}
      />

      <PositionsTable isWalletConnected={isWalletConnected} />
    </div>
  );
};
