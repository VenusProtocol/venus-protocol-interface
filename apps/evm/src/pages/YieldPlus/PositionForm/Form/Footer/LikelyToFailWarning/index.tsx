import BigNumber from 'bignumber.js';
import type { Address } from 'viem';

import { NoticeWarning } from 'components';
import { useTranslation } from 'libs/translations';
import type { SwapQuote, YieldPlusPosition } from 'types';
import { getSwapFromTokenAmount, getSwapToTokenAmount } from 'utilities';
import { getAmountCents } from './getAmountCents';

const MINIMUM_SWAP_AMOUNT_CENTS = 250; // $2.50

export interface LikelyToFailWarningProps {
  position: YieldPlusPosition;
  swapQuotes: SwapQuote[];
}

export const LikelyToFailWarning: React.FC<LikelyToFailWarningProps> = ({
  position,
  swapQuotes,
}) => {
  const { t } = useTranslation();

  const tokenPriceMapping = [position.dsaAsset, position.longAsset, position.shortAsset].reduce<
    Record<Address, BigNumber>
  >(
    (acc, asset) => ({
      ...acc,
      [asset.vToken.underlyingToken.address.toLowerCase()]: asset.tokenPriceCents,
    }),
    {},
  );

  let lowestSwapAmountCents = new BigNumber(Number.POSITIVE_INFINITY);

  swapQuotes.forEach(swapQuote => {
    const fromTokenAmountCents = getAmountCents({
      amountTokens: getSwapFromTokenAmount(swapQuote),
      token: swapQuote.fromToken,
      tokenPriceMapping,
    });

    if (fromTokenAmountCents?.isLessThan(lowestSwapAmountCents)) {
      lowestSwapAmountCents = fromTokenAmountCents;
    }

    const toTokenAmountCents = getAmountCents({
      amountTokens: getSwapToTokenAmount(swapQuote),
      token: swapQuote.toToken,
      tokenPriceMapping,
    });

    if (toTokenAmountCents?.isLessThan(lowestSwapAmountCents)) {
      lowestSwapAmountCents = toTokenAmountCents;
    }
  });

  if (lowestSwapAmountCents.isGreaterThanOrEqualTo(MINIMUM_SWAP_AMOUNT_CENTS)) {
    return undefined;
  }

  return (
    <NoticeWarning description={t('yieldPlus.operationForm.warning.txLikelyToFail')} size="sm" />
  );
};
