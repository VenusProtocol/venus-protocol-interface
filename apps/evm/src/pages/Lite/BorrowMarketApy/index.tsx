import { Apy, AssetApy } from 'components';
import type { LiteBorrowSource } from '../types';

export interface BorrowMarketApyProps {
  source: LiteBorrowSource;
  className?: string;
}

export const BorrowMarketApy: React.FC<BorrowMarketApyProps> = ({ source, className }) => {
  if (source.type === 'core') {
    return <AssetApy asset={source.asset} type="borrow" className={className} />;
  }

  return (
    <Apy
      type="borrow"
      className={className}
      token={source.asset.vToken.underlyingToken}
      baseApyPercentage={source.asset.borrowApyPercentage}
      tokenDistributions={source.asset.borrowTokenDistributions}
      userBalanceTokens={source.asset.userBorrowBalanceTokens}
    />
  );
};
