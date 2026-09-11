import type BigNumber from 'bignumber.js';

import formatPercentageToReadableValue from 'utilities/formatPercentageToReadableValue';

// Rewards lower the rate a borrower pays, so they read as negative on the borrow side
export const formatDistributionApyToReadableValue = ({
  apyPercentage,
  type,
}: {
  apyPercentage: BigNumber;
  type: 'supply' | 'borrow';
}) => formatPercentageToReadableValue(type === 'borrow' ? apyPercentage.negated() : apyPercentage);
