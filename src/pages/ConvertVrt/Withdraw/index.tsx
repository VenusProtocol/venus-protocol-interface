/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { ConnectWallet, Icon, PrimaryButton } from 'components';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';
import type { TransactionReceipt } from 'web3-core/types';

import { XVS_TOKEN_ID } from 'constants/xvs';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from '../styles';

export interface WithdrawProps {
  xvsWithdrawableAmount: BigNumber | undefined;
  withdrawXvs: () => Promise<TransactionReceipt>;
  withdrawXvsLoading: boolean;
}

const Withdraw: React.FC<WithdrawProps> = ({
  xvsWithdrawableAmount,
  withdrawXvs,
  withdrawXvsLoading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const { hasLunaOrUstCollateralEnabled, openLunaUstWarningModal } = useContext(
    DisableLunaUstWarningContext,
  );

  const readableXvsAvailable = useConvertWeiToReadableTokenString({
    valueWei: xvsWithdrawableAmount,
    tokenId: XVS_TOKEN_ID,
  });

  const handleTransactionMutation = useHandleTransactionMutation();

  const onSubmit = () => {
    // Block action is user has LUNA or UST enabled as collateral
    if (hasLunaOrUstCollateralEnabled) {
      openLunaUstWarningModal();
      return;
    }

    return handleTransactionMutation({
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
