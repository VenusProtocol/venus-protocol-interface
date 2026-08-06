import BigNumber from 'bignumber.js';

import { HEALTH_FACTOR_SAFE_MAX_THRESHOLD } from 'constants/healthFactor';
import type { Pool, Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

export interface GetLimitTokensInput {
  legacyPool: Pool | undefined;
  mintableVaiData:
    | {
        accountMintableVaiMantissa?: BigNumber;
        vaiLiquidityMantissa?: BigNumber;
      }
    | undefined;
  vai: Token;
}

export const getLimitTokens = ({
  legacyPool,
  mintableVaiData,
  vai,
}: GetLimitTokensInput): [BigNumber, BigNumber] => {
  // Return 0 values while asset is loading or if borrow limit has been reached
  if (
    !legacyPool?.vai?.tokenPriceCents ||
    !legacyPool ||
    legacyPool.userBorrowBalanceCents === undefined ||
    !legacyPool.userBorrowLimitCents ||
    legacyPool.userBorrowBalanceCents.isGreaterThanOrEqualTo(legacyPool.userBorrowLimitCents)
  ) {
    return [new BigNumber(0), new BigNumber(0)];
  }

  let marginWithUserSafeBorrowLimitTokens = legacyPool.userBorrowLimitCents
    .div(HEALTH_FACTOR_SAFE_MAX_THRESHOLD)
    .minus(legacyPool.userBorrowBalanceCents)
    // Convert to tokens
    .dividedBy(legacyPool.vai.tokenPriceCents);

  if (marginWithUserSafeBorrowLimitTokens.isLessThan(0)) {
    marginWithUserSafeBorrowLimitTokens = new BigNumber(0);
  }

  const maxTokens = convertMantissaToTokens({
    value: BigNumber.min(
      // Mintable limit
      mintableVaiData?.accountMintableVaiMantissa || new BigNumber(0),
      // Liquidities limit
      mintableVaiData?.vaiLiquidityMantissa || new BigNumber(0),
    ),
    token: vai,
  });

  const safeMaxTokens = BigNumber.min(maxTokens, marginWithUserSafeBorrowLimitTokens).dp(
    vai.decimals,
  );

  return [maxTokens, safeMaxTokens];
};
