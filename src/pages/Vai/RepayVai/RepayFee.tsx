/** @jsxImportSource @emotion/react */
import BigNumber from 'bignumber.js';
import { LabeledInlineContent } from 'components';
import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'translation';
import { convertTokensToWei, convertWeiToTokens } from 'utilities';

import { useGetVaiCalculateRepayAmount } from 'clients/api';
import { TOKENS } from 'constants/tokens';
import { AuthContext } from 'context/AuthContext';
import useDebounceValue from 'hooks/useDebounceValue';

import { useStyles } from '../styles';

const DEBOUNCE_DELAY = 300;

export interface RepayFeeProps {
  repayAmountTokens: string;
}

const RepayFee = ({ repayAmountTokens }: RepayFeeProps) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { account } = useContext(AuthContext);

  const debouncedAmountTokens = useDebounceValue(repayAmountTokens, DEBOUNCE_DELAY);

  const { data: vaiRepayAmountData } = useGetVaiCalculateRepayAmount(
    {
      accountAddress: account?.address || '',
      repayAmountWei: convertTokensToWei({
        value: new BigNumber(debouncedAmountTokens || 0),
        token: TOKENS.vai,
      }),
    },
    {
      enabled: !!account?.address,
      keepPreviousData: true,
    },
  );

  const readableRepayFee = useMemo(() => {
    const repayFeeWei = new BigNumber(vaiRepayAmountData?.vaiCurrentInterestWei || 0).plus(
      vaiRepayAmountData?.vaiPastInterestWei || 0,
    );

    const fee = convertWeiToTokens({
      valueWei: repayFeeWei,
      token: TOKENS.vai,
      minimizeDecimals: true,
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
