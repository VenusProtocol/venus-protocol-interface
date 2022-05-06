/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';
import { Typography } from '@mui/material';
import { ConnectWallet, PrimaryButton, Token } from 'components';
import useSuccessfulTransactionModal from 'hooks/useSuccessfulTransactionModal';
import toast from 'components/Basic/Toast';
import useConvertToReadableCoinString from 'hooks/useConvertToReadableCoinString';
import { useTranslation } from 'translation';
import { XVS_ID } from '../constants';
import { useStyles } from '../styles';

export interface IWithdrawProps {
  xvsVestedBalanceWei: BigNumber | undefined;
  withdrawXvs: () => Promise<string>;
  xvsWithdrawlLoading: boolean;
}

const Withdraw: React.FC<IWithdrawProps> = ({
  xvsVestedBalanceWei,
  withdrawXvs,
  xvsWithdrawlLoading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { openSuccessfulTransactionModal } = useSuccessfulTransactionModal();
  const readableXvsAvailable = useConvertToReadableCoinString({
    valueWei: xvsVestedBalanceWei,
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
            <Token symbol={XVS_ID} css={styles.successModalToken} variant="small2" />
            <Typography variant="small2" css={[styles.fontWeight600, styles.successMessage]}>
              {readableXvsAvailable}
            </Typography>
          </div>
        ),
      });
    } catch (err) {
      toast.error({ title: (err as Error).message });
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
            !xvsVestedBalanceWei || xvsVestedBalanceWei.isZero() || xvsVestedBalanceWei.isNaN()
          }
          fullWidth
          onClick={onSubmit}
          loading={xvsWithdrawlLoading}
        >
          {t('convertVrt.withdrawXvs')}
        </PrimaryButton>
      </ConnectWallet>
    </div>
  );
};

export default Withdraw;
