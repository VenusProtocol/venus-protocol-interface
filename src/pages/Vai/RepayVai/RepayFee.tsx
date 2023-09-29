/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { LabeledInlineContent } from 'components';
import { useGetToken } from 'packages/tokens';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { convertTokensToWei, convertWeiToTokens } from 'utilities';

import { useGetVaiCalculateRepayAmount } from 'clients/api';
import { AuthContext } from 'context/AuthContext';
import useDebounceValue from 'hooks/useDebounceValue';

import { useStyles } from '../styles';

const DEBOUNCE_DELAY = 300;

export interface IRepayFeeProps {
  repayAmountTokens: string;
}

const RepayFee = ({ repayAmountTokens }: IRepayFeeProps) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { accountAddress } = useContext(AuthContext);
  const vai = useGetToken({
    symbol: 'VAI',
  });

  const debouncedAmountTokens = useDebounceValue(repayAmountTokens, DEBOUNCE_DELAY);

  const { data: vaiRepayAmountData } = useGetVaiCalculateRepayAmount(
    {
      accountAddress: accountAddress || '',
      repayAmountWei: convertTokensToWei({
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
    const repayFeeWei = new BigNumber(vaiRepayAmountData?.vaiCurrentInterestWei || 0).plus(
      vaiRepayAmountData?.vaiPastInterestWei || 0,
    );

    const fee = convertWeiToTokens({
      valueWei: repayFeeWei,
      token: vai!,

      returnInReadableFormat: true,
    });

    const feePercentage = vaiRepayAmountData?.feePercentage || 0;
    const formattedFeePercentage = `${new BigNumber(feePercentage)
      .dp(feePercentage < 0.01 ? 6 : 2)
      .toNumber()}%`;

    return `${fee} (${formattedFeePercentage})`;
  }, [vaiRepayAmountData?.feePercentage]);

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
