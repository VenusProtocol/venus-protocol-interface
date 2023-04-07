import { getByText } from '@testing-library/react';
import { ExactAmountInSwap } from 'types';
import { convertWeiToTokens } from 'utilities';

import useGetSwapInfo from 'hooks/useGetSwapInfo';
import en from 'translation/translations/en.json';

export const getEnabledSubmitButton = ({
  swap,
  container,
}: {
  swap: ExactAmountInSwap;
  container: HTMLElement;
}) => {
  const expectedFromTokenAmountSoldTokens = convertWeiToTokens({
    valueWei: swap.fromTokenAmountSoldWei,
    token: swap.fromToken,
  });

  const expectedMinimumToTokenAmountReceivedTokens = convertWeiToTokens({
    valueWei: swap.minimumToTokenAmountReceivedWei,
    token: swap.fromToken,
  });

  // Check submit button is enabled
  const enabledSubmitButtonText = getByText(
    container,
    en.swapPage.submitButton.enabledLabel
      .replace(
        '{{fromTokenAmount}}',
        `${expectedFromTokenAmountSoldTokens.toFormat()} ${swap.fromToken.symbol}`,
      )
      .replace(
        '{{toTokenAmount}}',
        `${expectedMinimumToTokenAmountReceivedTokens.toFormat()} ${swap.toToken.symbol}`,
      ),
  );

  return enabledSubmitButtonText.closest('button');
};

export const getLastUseGetSwapInfoCallArgs = () =>
  (useGetSwapInfo as jest.Mock).mock.calls[(useGetSwapInfo as jest.Mock).mock.calls.length - 1];
