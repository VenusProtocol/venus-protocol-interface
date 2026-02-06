import { Accordion } from 'components';

import { SwapDetails as SwapDetailsComp } from 'containers/SwapDetails';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import type { ExactOutSwapQuote, Swap, SwapQuote } from 'types';
import TEST_IDS from '../testIds';

export interface SwapDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  action: 'repay' | 'supply';
  swap: Swap | SwapQuote;
  className?: string;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({ swap, action, ...otherProps }) => {
  const { t } = useTranslation();

  const readableToTokenAmountReceived = useConvertMantissaToReadableTokenString({
    value:
      swap.direction === 'exactAmountIn' || swap.direction === 'exact-in'
        ? swap.expectedToTokenAmountReceivedMantissa
        : (swap as ExactOutSwapQuote).toTokenAmountReceivedMantissa, // TODO: type check?
    token: swap.toToken,
  });

  const getAccordionTitle = () => {
    if (action === 'repay') {
      return swap.direction === 'exactAmountIn' || swap.direction === 'exact-in'
        ? t('operationForm.swapDetails.value.estimatedAmount', {
            value: readableToTokenAmountReceived,
          })
        : t('operationForm.swapDetails.value.exactAmount', {
            value: readableToTokenAmountReceived,
          });
    }

    return t('operationForm.swapDetails.value.estimatedAmount', {
      value: readableToTokenAmountReceived,
    });
  };

  return (
    <Accordion
      title={
        action === 'repay'
          ? t('operationForm.swapDetails.label.repay')
          : t('operationForm.swapDetails.label.supply')
      }
      rightLabel={getAccordionTitle()}
      data-testid={TEST_IDS.swapDetails}
      {...otherProps}
    >
      <SwapDetailsComp
        fromToken={swap.fromToken}
        toToken={swap.toToken}
        priceImpactPercentage={swap.priceImpactPercentage}
      />
    </Accordion>
  );
};
