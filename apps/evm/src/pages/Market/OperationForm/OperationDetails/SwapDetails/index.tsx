import { Accordion } from 'components';

import { SwapDetails as SwapDetailsComp } from 'containers/SwapDetails';
import useConvertMantissaToReadableTokenString from 'hooks/useConvertMantissaToReadableTokenString';
import { useTranslation } from 'libs/translations';
import type { Swap } from 'types';
import TEST_IDS from '../testIds';

export interface SwapDetailsProps extends React.HTMLAttributes<HTMLDivElement> {
  action: 'repay' | 'supply';
  swap: Swap;
  className?: string;
}

export const SwapDetails: React.FC<SwapDetailsProps> = ({ swap, action, ...otherProps }) => {
  const { t } = useTranslation();

  const readableToTokenAmountReceived = useConvertMantissaToReadableTokenString({
    value:
      swap.direction === 'exactAmountIn'
        ? swap.expectedToTokenAmountReceivedMantissa
        : swap.toTokenAmountReceivedMantissa,
    token: swap.toToken,
  });

  const getAccordionTitle = () => {
    if (action === 'repay') {
      return swap.direction === 'exactAmountIn'
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
        exchangeRate={swap.exchangeRate}
        fromToken={swap.fromToken}
        toToken={swap.toToken}
        priceImpactPercentage={swap.priceImpactPercentage}
      />
    </Accordion>
  );
};
