import type { Address } from 'viem';

import type { Pool, Token, YieldPlusPosition } from 'types';

export interface Row {
  positionAccountAddress: Address;
  longToken: Token;
  longBalanceTokens: BigNumber;
  longBalanceCents: number;
  shortToken: Token;
  shortBalanceTokens: BigNumber;
  shortBalanceCents: number;
  dsaToken: Token;
  dsaBalanceTokens: BigNumber;
  dsaBalanceCents: number;
  netValueCents: number;
  netApyPercentage: number;
  unrealizedPnlCents: number;
  unrealizedPnlPercentage: number;
  entryPriceTokens: BigNumber;
  entryPriceCents: number;
  liquidationPriceTokens: BigNumber;
  liquidationPriceCents: number;
  leverageFactor: number;
  pool: Pool;
}

export interface PositionListProps {
  positions: YieldPlusPosition[];
}
