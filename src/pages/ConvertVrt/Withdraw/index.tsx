/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { ConnectWallet, PrimaryButton, TokenIcon } from 'components';
import { ContractReceipt } from 'ethers';
import React, { useContext } from 'react';
import { useTranslation } from 'translation';

import { TOKENS } from 'constants/tokens';
import { DisableLunaUstWarningContext } from 'context/DisableLunaUstWarning';
import useConvertWeiToReadableTokenString from 'hooks/useConvertWeiToReadableTokenString';
import useHandleTransactionMutation from 'hooks/useHandleTransactionMutation';

import { useStyles } from '../styles';

export interface WithdrawProps {
  xvsWithdrawableAmount: BigNumber | undefined;
  withdrawXvs: () => Promise<ContractReceipt>;
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
    token: TOKENS.xvs,
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
      successTransactionModalProps: contractReceipt => ({
        title: t('convertVrt.successfulConvertTransactionModal.title'),
        transactionHash: contractReceipt.transactionHash,
        content: (
          <div css={styles.successModalConversionAmounts}>
            <TokenIcon token={TOKENS.xvs} css={styles.successModalToken} />
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
