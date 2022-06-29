/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@mui/material';
import type { TransactionReceipt } from 'web3-core/types';

import { ConnectWallet, Icon, PrimaryButton } from 'components';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import { useTranslation } from 'translation';
import { XVS_TOKEN_ID } from 'constants/xvs';
import { useStyles } from '../styles';

export interface IWithdrawProps {
  xvsWithdrawableAmount: BigNumber | undefined;
  withdrawXvs: () => Promise<TransactionReceipt>;
  withdrawXvsLoading: boolean;
}

const Withdraw: React.FC<IWithdrawProps> = ({
  xvsWithdrawableAmount,
  withdrawXvs,
  withdrawXvsLoading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const readableXvsAvailable = useConvertWeiToReadableTokenString({
    valueWei: xvsWithdrawableAmount,
    tokenId: XVS_TOKEN_ID,
  });

  const handleTransactionMutation = useHandleTransactionMutation();

  const onSubmit = () =>
    handleTransactionMutation({
      mutate: withdrawXvs,
      successTransactionModalProps: transactionReceipt => ({
        title: t('convertVrt.successfulConvertTransactionModal.title'),
        transactionHash: transactionReceipt.transactionHash,
        content: (
          <div css={styles.successModalConversionAmounts}>
            <Icon name={XVS_TOKEN_ID} css={styles.successModalToken} />
            <Typography variant="small2" css={[styles.fontWeight600, styles.successMessage]}>
              {readableXvsAvailable}
            </Typography>
          </div>
        ),
      }),
    });

  return (
    <div css={styles.root}>
      <ConnectWallet message={t('convertVrt.connectWalletToWithdrawXvs')}>
        <section css={styles.title}>
          <Typography variant="h3">{readableXvsAvailable}</Typography>
          <Typography variant="small2">{t('convertVrt.withdrawableAmount')}</Typography>
        </section>
        <PrimaryButton
          disabled={
            !xvsWithdrawableAmount ||
            xvsWithdrawableAmount.isZero() ||
            xvsWithdrawableAmount.isNaN()
          }
          fullWidth
          onClick={onSubmit}
          loading={withdrawXvsLoading}
        >
          {t('convertVrt.withdrawXvs')}
        </PrimaryButton>
      </ConnectWallet>
    </div>
  );
};

export default Withdraw;
