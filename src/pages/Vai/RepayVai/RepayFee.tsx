/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import { useGetVaiCalculateRepayAmount } from 'clients/api';
import { LabeledInlineContent } from 'components';
import useDebounceValue from 'hooks/useDebounceValue';
import { useGetToken } from 'packages/tokens';
import { useTranslation } from 'packages/translations';
import { useAccountAddress } from 'packages/wallet';
import { convertMantissaToTokens, convertTokensToMantissa } from 'utilities';

import { useStyles } from '../styles';

const DEBOUNCE_DELAY = 300;

export interface IRepayFeeProps {
  repayAmountTokens: string;
}

const RepayFee = ({ repayAmountTokens }: IRepayFeeProps) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { accountAddress } = useAccountAddress();
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const debouncedAmountTokens = useDebounceValue(repayAmountTokens, DEBOUNCE_DELAY);

  const { data: vaiRepayAmountData } = useGetVaiCalculateRepayAmount(
    {
      accountAddress: accountAddress || '',
      repayAmountMantissa: convertTokensToMantissa({
        value: new BigNumber(debouncedAmountTokens || 0),
        token: vai!,
      }),
    },
    {
      enabled: !!accountAddress,
      keepPreviousData: true,
    },
  );

  const readableRepayFee = useMemo(() => {
    const repayFeeMantissa = new BigNumber(
      vaiRepayAmountData?.vaiCurrentInterestMantissa || 0,
    ).plus(vaiRepayAmountData?.vaiPastInterestMantissa || 0);

    const fee = convertMantissaToTokens({
      value: repayFeeMantissa,
      token: vai!,

      returnInReadableFormat: true,
    });

    const feePercentage = vaiRepayAmountData?.feePercentage || 0;
    const formattedFeePercentage = `${new BigNumber(feePercentage)
      .dp(feePercentage < 0.01 ? 6 : 2)
      .toNumber()}%`;

    return `${fee} (${formattedFeePercentage})`;
  }, [vaiRepayAmountData, vai]);

  return (
    <LabeledInlineContent
      css={styles.getRow({ isLast: true })}
      iconSrc="fee"
      label={t('vai.repayVai.repayFeeLabel')}
      tooltip={t('vai.repayVai.repayFeeTooltip')}
    >
      {readableRepayFee}
    </LabeledInlineContent>
  );
};

export default RepayFee;
