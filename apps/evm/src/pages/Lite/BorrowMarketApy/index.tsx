import { Apy, AssetApy } from 'components';
import type { LiteBorrowSource } from '../types';

export interface BorrowMarketApyProps {
  source: LiteBorrowSource;
  showBadgeOnly?: boolean;
  className?: string;
}

export const BorrowMarketApy: React.FC<BorrowMarketApyProps> = ({
  source,
  showBadgeOnly,
  className,
}) => {
  if (source.type === 'core') {
    return (
      <AssetApy
        asset={source.asset}
        type="borrow"
        showBadgeOnly={showBadgeOnly}
        className={className}
      />
    );
  }

  return (
    <Apy
      type="borrow"
      className={className}
      token={source.asset.vToken.underlyingToken}
      baseApyPercentage={source.asset.borrowApyPercentage}
      tokenDistributions={source.asset.borrowTokenDistributions}
      userBalanceTokens={source.asset.userBorrowBalanceTokens}
      showBadgeOnly={showBadgeOnly}
    />
  );
};
