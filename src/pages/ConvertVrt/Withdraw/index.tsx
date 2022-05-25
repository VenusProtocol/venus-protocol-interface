/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@mui/material';
import { ConnectWallet, Icon, PrimaryButton, toast } from 'components';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import { useTranslation } from 'translation';
import { XVS_ID } from '../constants';
import { useStyles } from '../styles';

export interface IWithdrawProps {
  xvsWithdrawableAmount: BigNumber | undefined;
  withdrawXvs: () => Promise<string>;
  withdrawXvsLoading: boolean;
}

const Withdraw: React.FC<IWithdrawProps> = ({
  xvsWithdrawableAmount,
  withdrawXvs,
  withdrawXvsLoading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
  const readableXvsAvailable = useConvertToReadableCoinString({
    valueWei: xvsWithdrawableAmount,
    tokenId: XVS_ID,
  });
  const onSubmit = async () => {
    try {
      const transactionHash = await withdrawXvs();
      openSuccessfulTransactionModal({
        title: t('convertVrt.successfulConvertTransactionModal.title'),
        transactionHash,
        content: (
          <div css={styles.successModalConversionAmounts}>
            <Icon name={XVS_ID} css={styles.successModalToken} />
            <Typography variant="small2" css={[styles.fontWeight600, styles.successMessage]}>
              {readableXvsAvailable}
            </Typography>
          </div>
        ),
      });
    } catch (err) {
      toast.error({ message: (err as Error).message });
    }
  };
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
