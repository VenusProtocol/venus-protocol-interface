import { Apy, AssetApy } from 'components';
import type { LiteEarnMarketSource } from '../types';

export interface MarketApyProps {
  source: LiteEarnMarketSource;
  className?: string;
}

export const MarketApy: React.FC<MarketApyProps> = ({ source, className }) => {
  if (source.type === 'core') {
    return <AssetApy asset={source.asset} type="supply" className={className} />;
  }

  return (
    <Apy
      type="supply"
      className={className}
      token={source.hub.vhToken.underlyingToken}
      baseApyPercentage={source.hub.supplyApyPercentage}
      tokenDistributions={source.hub.supplyTokenDistributions}
      userBalanceTokens={source.hub.userSupplyBalanceTokens}
    />
  );
};
