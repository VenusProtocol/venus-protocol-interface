import BigNumber from 'bignumber.js';
import { Apy, AssetApy } from 'components';
import type { LiteEarnMarketSource } from '../types';

export interface MarketApyProps {
  source: LiteEarnMarketSource;
  showBadgeOnly?: boolean;
  className?: string;
}

export const MarketApy: React.FC<MarketApyProps> = ({ source, showBadgeOnly, className }) => {
  if (source.type === 'core') {
    return (
      <AssetApy
        asset={source.asset}
        type="supply"
        showBadgeOnly={showBadgeOnly}
        className={className}
      />
    );
  }

  if (source.type === 'hub') {
    return (
      <Apy
        type="supply"
        className={className}
        token={source.hub.vhToken.underlyingToken}
        baseApyPercentage={source.hub.supplyApyPercentage}
        tokenDistributions={source.hub.supplyTokenDistributions}
        userBalanceTokens={source.hub.userSupplyBalanceTokens}
        vTokenAddress={source.hub.vhMarketVTokenAddress}
        isLiquidityHub
        showBadgeOnly={showBadgeOnly}
      />
    );
  }

  return (
    <Apy
      type="supply"
      className={className}
      token={source.vault.stakedToken}
      baseApyPercentage={new BigNumber(source.vault.stakeAprPercentage)}
      tokenDistributions={[]}
      showBadgeOnly={showBadgeOnly}
    />
  );
};
